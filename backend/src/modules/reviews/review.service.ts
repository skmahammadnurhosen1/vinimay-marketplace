import { randomUUID } from 'node:crypto';
import { reviewRepository } from './review.repository.js';
import { orderRepository } from '../orders/order.repository.js';
import { productRepository } from '../products/product.repository.js';
import { ReviewEntity, ReviewStatus } from '../../types/review.js';

export class ReviewService {
  async submitReview(params: {
    customerId: string;
    customerName: string;
    orderId?: string;
    productId: string;
    rating?: number;
    productRating?: number;
    sellerRating?: number;
    deliveryRating?: number;
    title: string;
    comment: string;
    photos?: string[];
    videos?: string[];
    sellerId?: string;
  }): Promise<ReviewEntity> {
    const effectiveRating = params.productRating || params.rating || 5;

    // 1. Auto-discover verified purchase order if orderId was omitted
    let orderId = params.orderId;
    if (!orderId) {
      const customerOrders = await orderRepository.findByCustomerId(params.customerId);
      for (const ord of customerOrders) {
        const subOrders = await orderRepository.findSubOrdersByParentId(ord.id);
        for (const sub of subOrders) {
          if (sub.items.some((i) => i.productId === params.productId)) {
            orderId = ord.id;
            break;
          }
        }
        if (orderId) break;
      }
    }

    if (!orderId) {
      throw new Error('Only verified purchasers may submit a review. No purchase found for this product.');
    }

    const order = await orderRepository.findParentOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.customerId !== params.customerId) {
      throw new Error('You can only review products from your own orders');
    }

    // 2. Verify that product was actually purchased in this order
    const subOrders = await orderRepository.findSubOrdersByParentId(orderId);
    let matchedItem: any = null;
    let matchedSubOrder: any = null;

    for (const sub of subOrders) {
      const found = sub.items.find((i) => i.productId === params.productId);
      if (found) {
        matchedItem = found;
        matchedSubOrder = sub;
        break;
      }
    }

    if (!matchedItem) {
      throw new Error('Product was not found in this order. Only verified purchasers may submit a review.');
    }

    // 3. Prevent duplicate reviews by this customer for this product
    const existing = await reviewRepository.findByCustomerAndProduct(params.customerId, params.productId);
    if (existing) {
      throw new Error('You have already reviewed this product');
    }

    const product = await productRepository.findById(params.productId);
    const now = new Date().toISOString();

    const newReview: ReviewEntity = {
      id: `rev_${randomUUID()}`,
      customerId: params.customerId,
      customerName: params.customerName,
      productId: params.productId,
      productName: matchedItem.title || product?.productName || 'Automotive Spare Part',
      brand: matchedItem.brand || product?.brand || '',
      orderId: orderId || params.orderId || '',
      subOrderId: matchedSubOrder?.id || '',
      sellerId: params.sellerId || matchedSubOrder?.sellerId || matchedItem.sellerId || '',
      productRating: effectiveRating,
      rating: effectiveRating,
      sellerRating: params.sellerRating,
      deliveryRating: params.deliveryRating,
      title: params.title,
      comment: params.comment,
      photos: params.photos || [],
      videos: params.videos || [],
      verifiedPurchase: true,
      status: 'PENDING', // Initial state awaiting admin moderation
      helpfulVotes: 0,
      createdAt: now,
      updatedAt: now,
    };

    return reviewRepository.create(newReview);
  }

  async moderateReview(params: {
    reviewId: string;
    status: ReviewStatus;
    moderatedBy: string;
    rejectionReason?: string;
    moderationNotes?: string;
  }): Promise<ReviewEntity> {
    const review = await reviewRepository.findById(params.reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const now = new Date().toISOString();
    const updated = await reviewRepository.update(review.id, {
      status: params.status,
      rejectionReason: params.rejectionReason || null,
      moderationNotes: params.moderationNotes || null,
      reviewedBy: params.moderatedBy,
      reviewedAt: now,
    });

    return updated!;
  }
}

export const reviewService = new ReviewService();
