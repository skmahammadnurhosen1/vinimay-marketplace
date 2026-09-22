import React, { useState } from 'react';
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  EyeOff,
  Trash2,
  ThumbsUp,
} from 'lucide-react';
import { AdminReviewItem } from '../../types/admin';

interface AdminReviewsPageProps {
  reviews: AdminReviewItem[];
  onUpdateReviewStatus: (
    reviewId: string,
    status: 'Pending Moderation' | 'Approved' | 'Flagged' | 'Spam/Hidden'
  ) => void;
}

export const AdminReviewsPage: React.FC<AdminReviewsPageProps> = ({
  reviews,
  onUpdateReviewStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.productName.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.sellerName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${s <= rating ? 'fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-[#C59B27]" />
            <span>Customer Review Moderation & Verified Trust Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Safeguard marketplace integrity, filter illicit links/spam, and confirm Verified Purchase validity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Moderation Queue:</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
            {reviews.filter((r) => r.status === 'Pending Moderation').length} Awaiting Approval
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search review content, customer name, part, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="Pending Moderation">Pending Moderation</option>
            <option value="Approved">Approved / Live</option>
            <option value="Flagged">Flagged Suspicious</option>
            <option value="Spam/Hidden">Spam / Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 sm:p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-3 hover:shadow-sm transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{rev.customerName}</span>
                {rev.isVerifiedPurchase ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Purchase
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                    Unverified Buyer
                  </span>
                )}
                <span className="text-gray-700">• Order {rev.orderId} • {rev.date}</span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                  rev.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rev.status === 'Spam/Hidden'
                    ? 'bg-rose-100 text-rose-800'
                    : rev.status === 'Flagged'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {rev.status}
              </span>
            </div>

            {/* Ratings Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Part Quality:</span>
                {renderStars(rev.productRating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Seller Service:</span>
                {renderStars(rev.sellerRating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Logistics Delivery:</span>
                {renderStars(rev.deliveryRating)}
              </div>
            </div>

            {/* Product & Comment */}
            <div>
              <div className="text-xs text-gray-500 mb-1">
                Reviewed Part: <strong className="text-gray-900">{rev.productName}</strong> (Seller: {rev.sellerName})
              </div>
              <p className="text-xs text-gray-800 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-200 italic">
                "{rev.comment}"
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
              {rev.status !== 'Approved' && (
                <button
                  onClick={() => {
                    onUpdateReviewStatus(rev.id, 'Approved');
                    alert(`Review approved and published to storefront.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Publish</span>
                </button>
              )}

              {rev.status !== 'Flagged' && (
                <button
                  onClick={() => onUpdateReviewStatus(rev.id, 'Flagged')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flag Suspicious</span>
                </button>
              )}

              {rev.status !== 'Spam/Hidden' && (
                <button
                  onClick={() => {
                    onUpdateReviewStatus(rev.id, 'Spam/Hidden');
                    alert(`Review hidden from public view.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide / Mark Spam</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
