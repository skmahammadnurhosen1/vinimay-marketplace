import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-[#C59B27]">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating)
                ? 'fill-[#C59B27] text-[#C59B27]'
                : star - 0.5 <= rating
                ? 'fill-[#C59B27]/50 text-[#C59B27]'
                : 'text-stone-300 fill-stone-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-900 ml-0.5">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-stone-500 font-normal">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};
