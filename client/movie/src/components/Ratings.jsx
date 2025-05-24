import React, { useState } from 'react';
import axios from 'axios';

function Ratings({ initialRating = 0, onRatingChange, disabled = false, movieId }) {
  const [localRating, setLocalRating] = useState(initialRating);

  const updateRating = async (newRating) => {
    try {
      await axios.put(`http://localhost:5000/movies/${movieId}/rating`, { rating: newRating });
      console.log('Rating updated to:', newRating);
    } catch (err) {
      console.error('Error updating rating:', err);
    }
  };

  const handleRating = (newRating) => {
    if (disabled) return;
    setLocalRating(newRating);
    updateRating(newRating);
    if (onRatingChange) onRatingChange(newRating);
  };

  const handleDoubleClick = () => {
    if (disabled) return;
    setLocalRating(0);
    updateRating(0);
    if (onRatingChange) onRatingChange(0);
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => handleRating(i + 1)}
        onDoubleClick={i === 0 ? handleDoubleClick : undefined}
        className="star"
        style={{ 
          color: i < localRating ? '#FFD700' : '#CCC', 
          cursor: disabled ? 'default' : 'pointer',
          fontSize: '1.5rem',
          userSelect: 'none',
        }}
        role={disabled ? 'presentation' : 'button'}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && handleRating(i + 1)}
        aria-label={disabled ? `Rated ${localRating} stars` : `Rate ${i + 1} star`}
      >
        ★
      </span>
    ));

  return (
    <p><strong>Rating:</strong> {renderStars()}</p>
  );
}

export default Ratings;