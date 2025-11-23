import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import recommendationsService from '@services/recommendationsService';
import * as response from '@utils/response';

export const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(
    'getRecommendations: Getting recommendations for user',
    req.params.userId
  );
  try {
    const userIdAsString = req.params.userId;

    if (!ObjectId.isValid(userIdAsString)) {
      return response.error(res, 'Invalid user ID', 400);
    }

    const userId = new ObjectId(userIdAsString);

    const recommendations =
      await recommendationsService.getRecommendationsFor(userId);

    return response.success(res, { data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const getNewRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdAsString = req.params.userId;

    if (!ObjectId.isValid(userIdAsString)) {
      return response.error(res, 'Invalid user ID', 400);
    }

    const userId = new ObjectId(userIdAsString);

    const recommendations =
      await recommendationsService.getNewRecommendationsFor(userId);

    await recommendationsService.updateRecommendationsFor(
      userId,
      recommendations
    );

    return response.success(res, { data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const getRecommendationsWithFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdAsString = req.params.userId;
    const filters = req.body.filters;

    if (!ObjectId.isValid(userIdAsString)) {
      return response.error(res, 'Invalid user ID', 400);
    }

    const userId = new ObjectId(userIdAsString);

    const recommendations =
      await recommendationsService.getNewRecommendationsFor(
        new ObjectId(userId),
        filters
      );
    return response.success(res, { data: recommendations });
  } catch (error) {
    next(error);
  }
};
