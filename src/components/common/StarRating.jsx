import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  onRatingChange, 
  interactive = false,
  className = "" 
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const displayedRating = hoverRating || rating;

  const renderStar = (index) => {
    const starValue = index + 1;
    const isFull = displayedRating >= starValue;
    const isHalf = !isFull && displayedRating >= starValue - 0.5;

    return (
      <span
        key={index}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onMouseEnter={() => interactive && setHoverRating(starValue)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
      >
        {isFull ? (
          <Star size={size} fill="currentColor" className="text-yellow-500" />
        ) : isHalf ? (
          <StarHalf size={size} fill="currentColor" className="text-yellow-500" />
        ) : (
          <Star size={size} className="text-gray-300" />
        )}
      </span>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, i) => renderStar(i))}
    </div>
  );
};

export default StarRating;
