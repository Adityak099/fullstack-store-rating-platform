import React, { useState, useEffect } from 'react';

const RatingInput = ({ initialRating = 0, initialComment = '', onSubmit, disabled = false, allowEdit = true }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update state when props change
  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment]);

  const handleStarClick = (selectedRating) => {
    if (disabled) return;
    
    setRating(selectedRating);
    setShowCommentInput(true);
    setIsEditing(true);
  };

  const handleStarHover = (hoveredRating) => {
    if (disabled) return;
    setHoveredRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setShowCommentInput(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(initialRating);
    setComment(initialComment);
    setShowCommentInput(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowCommentInput(true);
  };

  const getStarClass = (star) => {
    const baseClass = 'text-2xl transition-all duration-200 star-hover';
    
    if (disabled) {
      const colorClass = star <= rating ? 'star-yellow' : 'star-white';
      return `${baseClass} cursor-not-allowed ${colorClass}`;
    }
    
    const colorClass = star <= (hoveredRating || rating) ? 'star-yellow' : 'star-white';
    return `${baseClass} cursor-pointer ${colorClass}`;
  };

  return (
    <div className="rating-input">
      <div className="flex items-center space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={getStarClass(star)}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
          >
            ⭐
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-600 ml-2">
            {rating} star{rating !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Show existing rating info if not editing */}
      {rating > 0 && !isEditing && !showCommentInput && allowEdit && (
        <div className="mb-2">
          {comment && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">
              "{comment}"
            </div>
          )}
          <button
            onClick={handleEdit}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {rating > 0 ? 'Modify Rating' : 'Add Rating'}
          </button>
        </div>
      )}

      {showCommentInput && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about your experience (optional)"
            className="w-full p-2 border border-gray-300 rounded-md resize-none text-sm"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : (initialRating > 0 ? 'Update Rating' : 'Submit Rating')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingInput;
