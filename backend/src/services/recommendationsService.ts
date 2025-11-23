import { Db, ObjectId } from 'mongodb';

import { MovieFilters, MovieResponse, Recommendation } from '@types';
import { getDatabase } from '@config/database';
import { LLM_LATEST_WATCHED_MOVIES_LIMIT } from '@config/llm.conf';
import llmService from './llmService';
import movieService from './movieService';

class RecommendationsService {
  private db: Db | null = null;

  private static instance: RecommendationsService;

  private getDb(): Db {
    if (!this.db) {
      this.db = getDatabase();
    }
    return this.db;
  }

  static getInstance(): RecommendationsService {
    if (!RecommendationsService.instance) {
      RecommendationsService.instance = new RecommendationsService();
    }
    return RecommendationsService.instance;
  }

  /**
   * Get new recommendations for a user
   * @description Get new recommendations for a user based on the latest watched movies and the LLM recommendations
   * @param {ObjectId} userId - The ID of the user
   * @param {MovieFilters} filters - The filters to apply to the recommendations
   * @param {number} filters.limit - The number of movies to return
   * @param {Array<string>} filters.genres - The genres of the movies to get
   * @param {Array<string>} filters.countries - The countries of the movies to get
   * @param {Object} filters.years - The years of the movies to get
   * @param {number} filters.years.min - The minimum year of the movies to get
   * @param {number} filters.years.max - The maximum year of the movies to get
   * @param {Object} filters.ratings - The ratings of the movies to get
   * @param {number} filters.ratings.min - The minimum rating of the movies to get
   * @param {number} filters.ratings.max - The maximum rating of the movies to get
   * @returns {Promise<Array<MovieResponse & { reason?: string }>>} The new recommendations for the user
   * @memberof RecommendationsService
   */
  async getNewRecommendationsFor(
    userId: ObjectId,
    filters?: MovieFilters
  ): Promise<Array<MovieResponse & { reason?: string }>> {
    const favoriteMovies = await movieService.getFavoriteMovies({
      userId,
      filters,
      limit: LLM_LATEST_WATCHED_MOVIES_LIMIT,
    });
    const recommendations = await llmService.generateRecommendations(
      favoriteMovies,
      filters
    );

    const enrichedRecommendations: Array<MovieResponse & { reason?: string }> =
      [];
    for (const rec of recommendations) {
      const movie = await movieService.search(rec.title, rec.year);
      if (movie) {
        enrichedRecommendations.push({ ...movie, reason: rec.reason });
      } else {
        console.warn(
          'RecommendationsService.getNewRecommendationsFor: movie not found',
          {
            title: rec.title,
          }
        );
      }
    }

    console.log(
      'RecommendationsService.getNewRecommendationsFor: enriched recommendations',
      {
        initialCount: recommendations.length,
        count: enrichedRecommendations.length,
        enrichedRecommendations: enrichedRecommendations.map((r) => r.title),
      }
    );

    return enrichedRecommendations;
  }

  /**
   * Get recommendations for a user
   * @description Get recommendations for a user based on the recommendations in the database
   * @param {ObjectId} userId - The ID of the user
   * @returns {Promise<Array<MovieResponse & { reason?: string }>>} The recommendations for the user
   * @memberof RecommendationsService
   */
  async getRecommendationsFor(
    userId: ObjectId
  ): Promise<Array<MovieResponse & { reason?: string }>> {
    const recommendationsDb = await this.getDb()
      .collection<Recommendation>('recommendations')
      .findOne({ userId });
    const recommendations = recommendationsDb?.recommendations;
    if (!recommendations) {
      return [];
    }

    const response = [];
    for (const recommendation of recommendations) {
      const movie = await movieService.getMovieById(recommendation.movieId);
      if (movie) {
        response.push({ ...movie, reason: recommendation.reason });
      }
    }

    return response;
  }

  /**
   * updateRecommendationsFor
   * @description Update recommendations for a user in the database
   * @param userId - The ID of the user
   * @param recommendations - The recommendations to update
   * @returns {Promise<void>} void
   * @memberof RecommendationsService
   */
  async updateRecommendationsFor(
    userId: ObjectId,
    recommendations: Array<MovieResponse & { reason?: string }>
  ): Promise<void> {
    await this.getDb()
      .collection('recommendations')
      .updateOne(
        { userId: userId },
        {
          $set: {
            recommendations: recommendations.map((recommendedMovie) => {
              return {
                movieId: new ObjectId(recommendedMovie._id),
                reason: recommendedMovie.reason,
              };
            }),
            createdAt: new Date(),
          },
          $setOnInsert: {
            _id: new ObjectId(),
            userId: userId,
          },
        },
        { upsert: true }
      );
  }
}

export default RecommendationsService.getInstance();
