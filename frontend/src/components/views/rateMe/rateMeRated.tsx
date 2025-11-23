import React, { useState } from 'react';

import Alert from '@/components/ui/Alert';
import Button from '@components/ui/Button';
import Highlight from '@components/ui/Highlight';

const RateMeRated = ({
  rating,
  review,
  onEditReview,
  onRemoveReview,
}: {
  rating: number;
  review: string;
  onEditReview: () => void;
  onRemoveReview: () => void;
}): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveReview = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Highlight variant="info" className="flex flex-col gap-2">
        <div className="flex flex-col gap-0">
          <h4 className="italic">Your review</h4>
          <p>
            <b>{rating / 10}</b> - {review || 'No review'}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="secondary" size="sm" onClick={onEditReview}>
            Edit review
          </Button>
          <Button variant="danger" size="sm" onClick={handleRemoveReview}>
            Remove review
          </Button>
        </div>
      </Highlight>

      <Alert
        type="question"
        variant="danger"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        callback={onRemoveReview}
      >
        Are you sure you want to remove your review?
      </Alert>
    </>
  );
};

export default RateMeRated;
