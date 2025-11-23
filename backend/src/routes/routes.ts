import { Router } from 'express';

import * as homeController from '@controllers/homeController';
import * as movieController from '@controllers/movieController';
import * as recommendationsController from '@controllers/recommendationsController';

const router = Router();

router.get('/', homeController.home);

router.get('/search/:query/:year', movieController.searchMovie);

router.get(
  '/:userId/recommendations',
  recommendationsController.getRecommendations
);
router.get(
  '/:userId/new-recommendations',
  recommendationsController.getNewRecommendations
);
router.post(
  '/:userId/recommendations/filters',
  recommendationsController.getRecommendationsWithFilters
);

router.get('/:userId/movie/:movieId/rating', movieController.getUserRating);

router.post('/:userId/movie/:movieId/watched', movieController.markAsWatched);
router.delete('/:userId/movie/:movieId/review', movieController.removeReview);

router.get('/genres', movieController.getGenres);
router.get('/countries', movieController.getCountries);

export default router;
