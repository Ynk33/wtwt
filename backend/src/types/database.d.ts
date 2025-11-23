import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Movie = {
  _id: ObjectId;
  externalIds: {
    tmdbId?: number;
  };
  title: string;
  alternativeTitles: string[];
  posterUrl: string;
  description: string;
  genres: string[];
  year: number;
  ratings: {
    tmdb?: number;
  };
  directors: ObjectId[];
  cast: ObjectId[];
  countries: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type People = {
  _id: ObjectId;
  externalIds: {
    tmdbId?: number;
  };
  name: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Genre = {
  _id: ObjectId;
  name: string;
  externalIds: {
    tmdbId?: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type UserMovie = {
  _id: ObjectId;
  userId: ObjectId;
  movieId: ObjectId;
  isWatched: boolean;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Recommendation = {
  _id: ObjectId;
  userId: ObjectId;
  recommendations: Array<{
    movieId: ObjectId;
    reason?: string;
  }>;
  createdAt: Date;
};

export type Country = {
  _id: ObjectId;
  iso_3166_1: string;
  english_name: string;
  native_name: string;
  createdAt: Date;
  updatedAt: Date;
};
