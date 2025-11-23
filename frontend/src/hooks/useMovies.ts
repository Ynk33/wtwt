import { useEffect, useState } from 'react';

import type { IMovie, MovieFilters } from '@types';
import api from '@services/api';

const useMovies = (
  userId: string,
  fetchOnMount: boolean = true
): {
  movies: IMovie[];
  isLoading: boolean;
  error: string | null;
  getRecommendations: (filters?: MovieFilters) => Promise<void>;
} => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (filters?: MovieFilters) => {
    setLoading(true);
    setError(null);

    try {
      const movies = await api.getNewRecommendations(userId, filters);
      setMovies(movies);
    } catch (error) {
      console.error('useMovies: Error refreshing recommendations', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const movies = await api.getRecommendations(userId);
        setMovies(movies);
      } catch (error) {
        console.error('useMovies: Error fetching movies', error);
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (fetchOnMount) {
      fetchRecommendations();
    }
  }, [userId, fetchOnMount]);

  return {
    movies,
    isLoading: loading,
    error,
    getRecommendations,
  };
};

export default useMovies;
