import { useEffect, useState } from 'react';

import { DEFAULT_RATING } from '@/app-conf';
import RateMeRated from '@components/views/rateMe/rateMeRated';
import RateMeReviewForm from '@components/views/rateMe/rateMeReviewForm';
import RateMeWatchedButton from '@components/views/rateMe/rateMeWatchedButton';
import useUserId from '@hooks/useUserId';
import useUserRating from '@hooks/useUserRating';

const RateMe = ({ movieId }: { movieId: string }) => {
  const userId = useUserId();
  const { userRating, isLoading, error, markAsWatched, removeReview } =
    useUserRating(userId, movieId);
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [review, setReview] = useState('');
  const [reviewed, setReviewed] = useState(false);

  const updateWatched = () => {
    setWatched(true);
  };

  const submitRating = (rating: number, review: string) => {
    setRating(rating);
    setReview(review);
    setReviewed(true);

    markAsWatched(userId, movieId, rating / 10, review);
  };

  const cancelRating = () => {
    if (userRating?.isWatched) {
      setReviewed(true);
    } else {
      setWatched(false);
    }
  };

  const editReview = () => {
    setReviewed(false);
  };

  const handleRemoveReview = () => {
    removeReview(userId, movieId).then((result) => {
      if (result) {
        setWatched(false);
        setReviewed(false);
        setRating(DEFAULT_RATING);
        setReview('');
      }
    });
  };

  useEffect(() => {
    if (userRating) {
      setWatched(userRating.isWatched ?? false);
      setRating(userRating.rating ? userRating.rating * 10 : DEFAULT_RATING);
      setReview(userRating.review ?? '');
      setReviewed(
        userRating.isWatched &&
          userRating.rating !== DEFAULT_RATING &&
          userRating.review !== ''
      );
    }
  }, [userRating]);

  return (
    <>
      {isLoading && <div>Loading...</div>}

      {!isLoading && error && <div>Error: {error}</div>}

      {!isLoading && !error && (
        <div>
          {!watched && <RateMeWatchedButton onClick={updateWatched} />}

          {watched && !reviewed && (
            <RateMeReviewForm
              initialRating={rating}
              initialReview={review}
              submitRating={submitRating}
              cancelRating={cancelRating}
            />
          )}

          {watched && reviewed && (
            <RateMeRated
              rating={rating}
              review={review}
              onEditReview={editReview}
              onRemoveReview={handleRemoveReview}
            />
          )}
        </div>
      )}
    </>
  );
};

export default RateMe;
