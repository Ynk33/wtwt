import { useEffect, useState } from 'react';

import type { ICountry } from '@types';
import api from '@services/api';

const useCountries = (): {
  countries: ICountry[];
  isLoading: boolean;
  error: string | null;
} => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);

      try {
        const countries = await api.getCountries();
        setCountries(countries);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return {
    countries,
    isLoading: loading,
    error,
  };
};

export default useCountries;
