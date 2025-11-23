export type { ApiResponse } from './api';

export type MovieFilters = {
  genres?: Array<string>;
  countries?: Array<string>;
  years?: {
    min?: number;
    max?: number;
  };
  ratings?: {
    min?: number;
    max?: number;
  };
};

export interface IMovieApi {
  getRecommendations(userId: string): Promise<IMovie[]>;
  getNewRecommendations(
    userId: string,
    filters?: MovieFilters
  ): Promise<IMovie[]>;
  markAsWatched(
    userId: string,
    movieId: string,
    rating?: number,
    review?: string
  ): Promise<boolean>;
  removeReview(userId: string, movieId: string): Promise<boolean>;
  getUserRating(userId: string, movieId: string): Promise<IUserMovie | null>;
  getGenres(): Promise<IGenre[]>;
  getCountries(): Promise<ICountry[]>;
}

export interface IMovie {
  _id: string;
  externalIds: {
    tmdbId?: number;
  };
  title: string;
  posterUrl: string;
  description: string;
  genres: string[];
  year: number;
  ratings: {
    tmdb?: number;
  };
  directors: Array<IPeople>;
  cast: Array<IPeople>;
  countries: Array<string>;
  reason?: string;
}

export interface IGenre {
  _id: string;
  externalIds: {
    tmdbId?: number;
  };
  name: string;
}

export interface ICountry {
  _id: string;
  name: string;
}

export interface IPeople {
  _id: string;
  externalIds: {
    tmdbId?: number;
  };
  name: string;
  photoUrl: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface IUserMovie {
  _id: string;
  userId: string;
  movieId: string;
  isWatched: boolean;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}
