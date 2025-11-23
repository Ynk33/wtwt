import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import movieService from '@services/movieService';
import * as response from '@utils/response';

export const searchMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, year } = req.params;

    if (!query) {
      return response.error(res, 'Query is required', 400);
    }

    const movie = await movieService.simpleSearch(
      query,
      year ? Number(year) : undefined
    );
    return response.success(res, { data: movie });
  } catch (error) {
    next(error);
  }
};

export const markAsWatched = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { movieId, userId } = req.params;
    const { rating, review } = req.body;

    if (!ObjectId.isValid(movieId) || !ObjectId.isValid(userId)) {
      return response.error(res, 'Invalid movie or user ID', 400);
    }

    await movieService.markAsWatched(
      new ObjectId(userId),
      new ObjectId(movieId),
      rating,
      review
    );

    return response.success(res, { data: true });
  } catch (error) {
    next(error);
  }
};

export const removeReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { movieId, userId } = req.params;

    if (!ObjectId.isValid(movieId) || !ObjectId.isValid(userId)) {
      return response.error(res, 'Invalid movie or user ID', 400);
    }

    const result = await movieService.removeReview(
      new ObjectId(userId),
      new ObjectId(movieId)
    );
    return response.success(res, { data: result });
  } catch (error) {
    next(error);
  }
};

export const getUserRating = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, movieId } = req.params;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(movieId)) {
      return response.error(res, 'Invalid movie or user ID', 400);
    }

    const rating = await movieService.getUserRating(
      new ObjectId(userId),
      new ObjectId(movieId)
    );

    return response.success(res, { data: rating });
  } catch (error) {
    next(error);
  }
};

export const getGenres = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const genres = await movieService.getGenres();
    return response.success(res, { data: genres });
  } catch (error) {
    next(error);
  }
};

export const getCountries = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const countries = await movieService.getCountries();
    return response.success(res, { data: countries });
  } catch (error) {
    next(error);
  }
};
