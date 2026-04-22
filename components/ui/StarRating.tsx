import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFull = rating >= starValue;
        const isHalf = !isFull && rating >= starValue - 0.5;

        return (
          <span key={i} className="text-popcorn-gold">
            {isFull ? (
              <Star size={14} fill="currentColor" />
            ) : isHalf ? (
              <StarHalf size={14} fill="currentColor" />
            ) : (
              <Star size={14} />
            )}
          </span>
        );
      })}
      <span className="ml-2 text-xs font-bold text-popcorn-gold">{rating.toFixed(1)}</span>
    </div>
  )
}
