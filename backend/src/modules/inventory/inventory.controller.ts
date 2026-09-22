import { Request, Response } from 'express';
import { inventoryRepository } from './inventory.repository.js';
import { sellerRepository } from '../sellers/seller.repository.js';
import { productRepository } from '../products/product.repository.js';
import { adjustStockSchema } from './inventory.validation.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export async function getSellerInventory(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const lowStockOnly = req.query.lowStockOnly === 'true';
  const items = await inventoryRepository.findBySeller(seller.id, { lowStockOnly });

  // Enrich with product details matching frontend SellerInventoryItem
  const enriched = await Promise.all(
    items.map(async (item) => {
      const prod = await productRepository.findById(item.productId);
      return {
        productId: item.productId,
        title: prod ? prod.productName : 'Automobile Spare Part',
        partNumber: prod ? prod.partNumber : 'N/A',
        brand: prod ? prod.brand : 'N/A',
        category: prod ? prod.category : 'N/A',
        image: prod && prod.images.length > 0 ? prod.images[0].url : '/assets/cat_engine.jpg',
        currentStock: item.currentStock,
        reservedStock: item.reservedStock,
        availableStock: item.availableStock,
        lowStockThreshold: item.lowStockThreshold,
        isLowStock: item.currentStock <= item.lowStockThreshold,
        unitPrice: prod ? prod.price : 0,
        totalValue: prod ? item.currentStock * prod.price : 0,
        sku: item.sku,
        status: item.status,
        lastRestocked: item.lastRestockedAt,
      };
    })
  );

  sendSuccess(res, { inventory: enriched, total: enriched.length });
}

export async function getProductInventory(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.productId;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  const item = await inventoryRepository.findByProductId(productId);
  if (!item) {
    sendError(res, 'Inventory record not found for this product', 404, 'INVENTORY_NOT_FOUND');
    return;
  }

  if (item.sellerId !== seller.id && req.user.role !== 'ADMIN') {
    sendError(res, 'Unauthorized access to inventory record', 403, 'FORBIDDEN');
    return;
  }

  const movements = await inventoryRepository.getMovementsByProduct(productId, 20);
  sendSuccess(res, { inventory: item, movements });
}

export async function adjustProductStock(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    return;
  }

  const seller = await sellerRepository.findByUserId(req.user.uid);
  if (!seller) {
    sendError(res, 'Seller profile required', 403, 'SELLER_PROFILE_REQUIRED');
    return;
  }

  const rawId = req.params.productId;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  const parseResult = adjustStockSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(
      res,
      parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      400,
      'VALIDATION_ERROR'
    );
    return;
  }

  const { delta, type, reason, referenceId } = parseResult.data;

  try {
    const result = await inventoryRepository.adjustStock({
      productId,
      sellerId: seller.id,
      delta,
      type,
      reason,
      referenceId,
      performedBy: req.user.uid,
    });

    // If stock became 0, update product status to OUT_OF_STOCK
    const product = await productRepository.findById(productId);
    if (product) {
      if (result.inventory.currentStock === 0 && product.status === 'APPROVED') {
        await productRepository.update(productId, { status: 'OUT_OF_STOCK' });
      } else if (result.inventory.currentStock > 0 && product.status === 'OUT_OF_STOCK') {
        await productRepository.update(productId, { status: 'APPROVED' });
      }
    }

    sendSuccess(res, result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Stock adjustment failed';
    if (message.includes('NEGATIVE_STOCK_NOT_ALLOWED') || message.includes('INSUFFICIENT_AVAILABLE_STOCK')) {
      sendError(res, message, 400, 'INVALID_STOCK_OPERATION');
      return;
    }
    if (message.includes('INVENTORY_NOT_FOUND')) {
      sendError(res, message, 404, 'INVENTORY_NOT_FOUND');
      return;
    }
    if (message.includes('UNAUTHORIZED_SELLER')) {
      sendError(res, message, 403, 'FORBIDDEN');
      return;
    }
    sendError(res, message, 500, 'INTERNAL_ERROR');
  }
}
