import { getFirestore } from '../../config/firebase.js';
import { env } from '../../config/environment.js';
import {
  ReviewEntity,
  ReviewStatus,
  ProductReviewSummary,
  SellerReviewSummary,
} from '../../types/review.js';
import { logger } from '../../utils/logger.js';

const COLLECTION_NAME = 'reviews';

export class ReviewRepository {
  private inMemoryReviews: Map<string, ReviewEntity> = new Map();

  private shouldUseFirestore(): boolean {
    return env.NODE_ENV !== 'test' && !!env.FIREBASE_CLIENT_EMAIL && !!env.FIREBASE_PRIVATE_KEY;
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    this.inMemoryReviews.set(review.id, { ...review });

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(review.id).set(review);
      } catch (error) {
        logger.error('Error creating review in Firestore:', { error: String(error) });
      }
    }

    return review;
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const memory = this.inMemoryReviews.get(id);
    if (memory) return { ...memory };

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const doc = await db.collection(COLLECTION_NAME).doc(id).get();
        if (doc.exists) {
          const data = doc.data() as ReviewEntity;
          this.inMemoryReviews.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding review by ID in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findDuplicate(
    customerId: string,
    productId: string,
    orderId: string
  ): Promise<ReviewEntity | null> {
    for (const rev of this.inMemoryReviews.values()) {
      if (
        rev.customerId === customerId &&
        rev.productId === productId &&
        rev.orderId === orderId
      ) {
        return { ...rev };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(COLLECTION_NAME)
          .where('customerId', '==', customerId)
          .where('productId', '==', productId)
          .where('orderId', '==', orderId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as ReviewEntity;
          this.inMemoryReviews.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error checking duplicate review in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByCustomerAndProduct(
    customerId: string,
    productId: string
  ): Promise<ReviewEntity | null> {
    for (const rev of this.inMemoryReviews.values()) {
      if (rev.customerId === customerId && rev.productId === productId) {
        return { ...rev };
      }
    }

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        const snapshot = await db
          .collection(COLLECTION_NAME)
          .where('customerId', '==', customerId)
          .where('productId', '==', productId)
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as ReviewEntity;
          this.inMemoryReviews.set(data.id, data);
          return data;
        }
      } catch (error) {
        logger.error('Error finding customer review in Firestore:', { error: String(error) });
      }
    }

    return null;
  }

  async findByProduct(productId: string, status: ReviewStatus = 'APPROVED'): Promise<ReviewEntity[]> {
    const results: ReviewEntity[] = [];
    for (const rev of this.inMemoryReviews.values()) {
      if (rev.productId === productId && rev.status === status) {
        results.push({ ...rev });
      }
    }
    return results;
  }

  async findBySeller(sellerId: string, status: ReviewStatus = 'APPROVED'): Promise<ReviewEntity[]> {
    const results: ReviewEntity[] = [];
    for (const rev of this.inMemoryReviews.values()) {
      if (rev.sellerId === sellerId && rev.status === status) {
        results.push({ ...rev });
      }
    }
    return results;
  }

  async findAll(status?: ReviewStatus): Promise<ReviewEntity[]> {
    let list = Array.from(this.inMemoryReviews.values());
    if (status) {
      list = list.filter((r) => r.status === status);
    }
    return list.map((r) => ({ ...r }));
  }

  async update(id: string, updates: Partial<ReviewEntity>): Promise<ReviewEntity | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ReviewEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryReviews.set(id, updated);

    if (this.shouldUseFirestore()) {
      try {
        const db = getFirestore();
        await db.collection(COLLECTION_NAME).doc(id).set(updated, { merge: true });
      } catch (error) {
        logger.error('Error updating review in Firestore:', { error: String(error) });
      }
    }

    return updated;
  }

  async getProductReviewSummary(productId: string): Promise<ProductReviewSummary> {
    const approved = await this.findByProduct(productId, 'APPROVED');
    if (approved.length === 0) {
      return {
        productId,
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const rev of approved) {
      sum += rev.productRating;
      breakdown[rev.productRating] = (breakdown[rev.productRating] || 0) + 1;
    }

    return {
      productId,
      averageRating: Math.round((sum / approved.length) * 10) / 10,
      totalReviews: approved.length,
      ratingBreakdown: breakdown,
    };
  }

  async getSellerReviewSummary(sellerId: string): Promise<SellerReviewSummary> {
    const approved = await this.findBySeller(sellerId, 'APPROVED');
    const withSellerRating = approved.filter((r) => r.sellerRating !== undefined);
    if (withSellerRating.length === 0) {
      return { sellerId, averageRating: 0, totalReviews: 0 };
    }

    const sum = withSellerRating.reduce((acc, r) => acc + (r.sellerRating || 0), 0);
    return {
      sellerId,
      averageRating: Math.round((sum / withSellerRating.length) * 10) / 10,
      totalReviews: withSellerRating.length,
    };
  }

  resetInMemory(): void {
    this.inMemoryReviews.clear();
  }
}

export const reviewRepository = new ReviewRepository();
