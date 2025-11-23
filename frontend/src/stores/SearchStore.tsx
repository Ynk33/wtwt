import { create } from 'zustand';

import type { ICountry, IGenre, MovieFilters } from '@types';

interface SearchState {
  // Search filters
  genres: IGenre[];
  excludedGenres: IGenre[];
  countries: ICountry[];
  years: { min?: number; max?: number };
  ratings: { min?: number; max?: number };

  // Actions to update filters
  setGenres: (genres: IGenre[]) => void;
  setExcludedGenres: (genres: IGenre[]) => void;
  setCountries: (countries: ICountry[]) => void;
  setYears: (years: { min?: number; max?: number }) => void;
  setRatings: (ratings: { min?: number; max?: number }) => void;

  // Action to reset all filters
  resetFilters: () => void;

  // Method to convert state to MovieFilters (API format)
  getMovieFilters: () => MovieFilters;
}

const initialState = {
  genres: [],
  excludedGenres: [],
  countries: [],
  years: {},
  ratings: {},
};

export const useSearchStore = create<SearchState>((set, get) => ({
  ...initialState,

  setGenres: (genres) => set({ genres }),

  setExcludedGenres: (excludedGenres) => set({ excludedGenres }),

  setCountries: (countries) => set({ countries }),

  setYears: (years) => set({ years }),

  setRatings: (ratings) => set({ ratings }),

  resetFilters: () => set(initialState),

  getMovieFilters: () => {
    const state = get();
    const filters: MovieFilters = {};

    // Convert genres to string names
    if (state.genres.length > 0) {
      filters.genres = state.genres.map((genre) => genre.name);
    }

    // Convert countries to string names
    if (state.countries.length > 0) {
      filters.countries = state.countries.map((country) => country.name);
    }

    // Add years if defined
    if (state.years.min !== undefined || state.years.max !== undefined) {
      filters.years = {};
      if (state.years.min !== undefined) {
        filters.years.min = state.years.min;
      }
      if (state.years.max !== undefined) {
        filters.years.max = state.years.max;
      }
    }

    // Add ratings if defined
    if (state.ratings.min !== undefined || state.ratings.max !== undefined) {
      filters.ratings = {};
      if (state.ratings.min !== undefined) {
        filters.ratings.min = state.ratings.min;
      }
      if (state.ratings.max !== undefined) {
        filters.ratings.max = state.ratings.max;
      }
    }

    return filters;
  },
}));
