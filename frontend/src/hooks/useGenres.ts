import { useEffect, useState } from 'react';

import type { IGenre } from '@types';
import api from '@services/api';

const useGenres = (): {
  genres: IGenre[];
  isLoading: boolean;
  error: string | null;
} => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);

      try {
        const genres = await api.getGenres();
        setGenres(genres);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return {
    genres,
    isLoading: loading,
    error,
  };
};

export default useGenres;
