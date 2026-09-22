export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';

export interface ReviewEntity {
  id: string; // e.g. `rev_${uuid}`
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  brand: string;
  orderId: string;
  subOrderId: string;
  sellerId: string;
  productRating: number; // 1 to 5
  rating?: number;
  sellerRating?: number; // 1 to 5
  deliveryRating?: number; // 1 to 5
  title: string;
  comment: string;
  photos: string[];
  videos: string[];
  verifiedPurchase: boolean;
  status: ReviewStatus;
  rejectionReason?: string | null;
  moderationNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>; // 1: n, 2: n, 3: n, 4: n, 5: n
}

export interface SellerReviewSummary {
  sellerId: string;
  averageRating: number;
  totalReviews: number;
}
