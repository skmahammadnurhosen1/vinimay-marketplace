import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquare, Image, ShieldCheck } from 'lucide-react';
import { Review } from '../../types';
import { getProductReviews } from '../../data/reviews';

interface ReviewSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  rating,
  reviewCount
}) => {
  const [filterMode, setFilterMode] = useState<'all' | '5star' | 'verified' | 'photos'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const reviews = getProductReviews(productId);

  // Star Distribution percentages
  const distribution = [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 14 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 0 }
  ];

  const handleHelpfulClick = (reviewId: string, initialCount: number) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1
    }));
  };

  const filteredReviews = reviews.filter(r => {
    if (filterMode === '5star') return r.rating === 5;
    if (filterMode === 'photos') return r.photos && r.photos.length > 0;
    if (filterMode === 'verified') return r.verifiedPurchase;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs my-8 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#0B56D0]" />
          <span>Customer Reviews & Installation Feedback</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Real feedback from verified fleet operators, mechanics, and automobile owners
        </p>
      </div>

      {/* Summary Score & Distribution Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 items-center">
        {/* Big Score Box (4 cols) */}
        <div className="md:col-span-4 text-center md:border-r border-gray-200 md:pr-6 space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-gray-950 font-mono">
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 text-amber-400 py-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-700">
            Based on {reviewCount.toLocaleString()} Verified Customer Ratings
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 pt-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Verified Buyer Reviews</span>
          </div>
        </div>

        {/* 5-Star Breakdown (8 cols) */}
        <div className="md:col-span-8 space-y-2 text-xs">
          {distribution.map(item => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-12 font-medium text-gray-600 text-right">
                {item.stars} Stars
              </span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFBA00] rounded-full transition-all duration-500"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="w-10 text-gray-500 font-mono text-[11px]">
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-[#0B56D0] text-white shadow-2xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('5star')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterMode === '5star'
              ? 'bg-[#0B56D0] text-white shadow-2xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          5-Star Ratings
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('photos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'photos'
              ? 'bg-[#0B56D0] text-white shadow-2xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>With Customer Photos</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'verified'
              ? 'bg-[#0B56D0] text-white shadow-2xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Verified Purchases Only
        </button>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4 pt-2">
        {filteredReviews.map(rev => {
          const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount;

          return (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-3 hover:border-blue-200 transition-colors"
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0B56D0] font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-blue-200">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                    ) : (
                      rev.userName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">
                        {rev.userName}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {rev.date} {rev.vehicleUsed && `• ${rev.vehicleUsed}`}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Title & Body */}
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-950">
                  {rev.title}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Review Photos if any */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {rev.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden p-1"
                    >
                      <img src={photo} alt="" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful footer */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#0B56D0] font-medium transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({currentHelpful})</span>
                </button>

                <span className="text-[11px] text-gray-400">Feedback on genuine fitment</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
