import { ObjectId } from 'mongodb';

export type MovieFilters = {
  genres?: Array<string>;
  countries?: Array<string>;
  years?: { min?: number; max?: number };
  ratings?: { min?: number; max?: number };
};

export interface IMovieDbService {
  search(title: string): Promise<MovieResponse | null>;
  getFavoriteMovies({
    userId,
    filters,
    limit,
  }: {
    userId: ObjectId;
    filters?: MovieFilters;
    limit?: number;
  }): Promise<Array<UserMoviesWatched>>;
  markAsWatched(
    userId: ObjectId,
    movieId: ObjectId,
    rating?: number,
    review?: string
  ): Promise<void>;
  removeReview(userId: ObjectId, movieId: ObjectId): Promise<boolean>;
  getUserRating(userId: ObjectId, movieId: ObjectId): Promise<UserMovie | null>;
}

export interface IMovieApiService {
  search(title: string, year?: number): Promise<string | null>;
  searchById(id: string): Promise<MovieResponse | null>;
}

export type MovieResponse = {
  _id?: string;
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
  directors: Array<PeopleResponse>;
  cast: Array<PeopleResponse>;
  countries: Array<string>;
};

export type PeopleResponse = {
  _id?: string;
  externalIds: {
    tmdbId?: number;
  };
  name: string;
  photoUrl: string;
};

export type GenreResponse = {
  _id?: string;
  externalIds: {
    tmdbId?: number;
  };
  name: string;
};

export type CountryResponse = {
  _id?: string;
  name: string;
};

export type UserMoviesWatched = {
  title: string;
  year: number;
  rating?: number;
  review?: string;
};

export interface ILLMService {
  generateRecommendations(
    latestWatchedMovies: UserMoviesWatched[]
  ): Promise<LLMRecommendation[]>;
}

export interface LLMRecommendation {
  tmdbId?: number;
  title: string;
  year: number;
  reason?: string;
}
