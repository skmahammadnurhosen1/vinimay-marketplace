import { Router } from 'express';
import {
  createSellerProduct,
  getSellerProducts,
  getSellerProductById,
  updateSellerProduct,
  deleteSellerProduct,
  toggleProductStatus,
  getPublicCatalog,
  searchProducts,
  getCompatibleProducts,
  getPublicProductById,
  checkProductFitment,
  submitProductVerification,
  getProductVerification,
} from './product.controller.js';
import { requireAuthentication } from '../../middlewares/auth.js';

// Public Catalog Router (/api/v1/products)
export const publicProductRouter = Router();
publicProductRouter.get('/', getPublicCatalog);
publicProductRouter.get('/search', searchProducts);
publicProductRouter.get('/compatible', getCompatibleProducts);
publicProductRouter.get('/:id', getPublicProductById);
publicProductRouter.post('/:id/check-fitment', checkProductFitment);

// Seller Products Management Router (/api/v1/sellers/products)
export const sellerProductRouter = Router();
sellerProductRouter.use(requireAuthentication);
sellerProductRouter.post('/', createSellerProduct);
sellerProductRouter.get('/', getSellerProducts);
sellerProductRouter.get('/:id', getSellerProductById);
sellerProductRouter.patch('/:id', updateSellerProduct);
sellerProductRouter.delete('/:id', deleteSellerProduct);
sellerProductRouter.patch('/:id/status', toggleProductStatus);
sellerProductRouter.post('/:id/verification', submitProductVerification);
sellerProductRouter.get('/:id/verification', getProductVerification);
