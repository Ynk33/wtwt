import React, { useState } from 'react';

import Button from '@components/ui/Button';

const RateMeReviewForm = ({
  initialRating,
  initialReview,
  submitRating,
  cancelRating,
}: {
  initialRating: number;
  initialReview: string;
  submitRating: (rating: number, review: string) => void;
  cancelRating: () => void;
}): React.ReactNode => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);

  const updateRating = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(event.target.value));
  };

  const updateReview = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="100"
          value={rating}
          onChange={updateRating}
        />
        <span>{rating / 10}</span>
      </div>
      <textarea
        name="review"
        id="review"
        placeholder="Review"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={review}
        onChange={updateReview}
      />
      <div className="flex flex-row gap-2">
        <Button variant="primary" onClick={() => submitRating(rating, review)}>
          Submit
        </Button>
        <Button variant="secondary" onClick={cancelRating}>
          cancel
        </Button>
      </div>
    </>
  );
};

export default RateMeReviewForm;
