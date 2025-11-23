import { useEffect, useState } from 'react';

import type { IUserMovie } from '@types';
import api from '@services/api';

const useUserRating = (
  userId: string,
  movieId: string
): {
  userRating: IUserMovie | null;
  isLoading: boolean;
  error: string | null;
  markAsWatched: (
    userId: string,
    movieId: string,
    rating?: number,
    review?: string
  ) => Promise<boolean>;
  removeReview: (userId: string, movieId: string) => Promise<boolean>;
} => {
  const [userRating, setUserRating] = useState<IUserMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsWatched = async (
    userId: string,
    movieId: string,
    rating?: number,
    review?: string
  ) => {
    try {
      const response = await api.markAsWatched(userId, movieId, rating, review);
      return response;
    } catch (error) {
      console.error('useMovies: Error marking as watched', error);
      throw error;
    }
  };

  const removeReview = async (userId: string, movieId: string) => {
    try {
      const response = await api.removeReview(userId, movieId);
      return response;
    } catch (error) {
      console.error('useMovie: Error removing review', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      setLoading(true);
      setError(null);

      try {
        const rating = await api.getUserRating(userId, movieId);
        setUserRating(rating);
      } catch (error) {
        console.error('useMovies: Error fetching movies', error);
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [userId, movieId]);

  return {
    userRating,
    isLoading: loading,
    error,
    markAsWatched,
    removeReview,
  };
};

export default useUserRating;
