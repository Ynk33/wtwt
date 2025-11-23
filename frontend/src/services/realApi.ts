import axios, { type AxiosInstance } from 'axios';

import type {
  ApiResponse,
  ICountry,
  IGenre,
  IMovie,
  IMovieApi,
  IUserMovie,
  MovieFilters,
} from '@types';

class RealApi implements IMovieApi {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async getRecommendations(userId: string): Promise<IMovie[]> {
    try {
      console.log(
        'RealApi.getRecommendations: Getting recommendations for user',
        userId
      );
      const response = await this.apiClient.get<ApiResponse<IMovie[]>>(
        `/${userId}/recommendations`
      );

      console.log(
        'RealApi.getRecommendations: Recommendations',
        response.data?.data?.data
      );
      return response.data?.data?.data || [];
    } catch (error) {
      console.error(
        'RealApi.getRecommendations: Error getting recommendations',
        error
      );
      throw error;
    }
  }

  async getNewRecommendations(
    userId: string,
    filters?: MovieFilters
  ): Promise<IMovie[]> {
    try {
      console.log(
        'RealApi.getNewRecommendations: Getting new recommendations',
        { userId, filters }
      );

      const method = filters ? 'post' : 'get';
      const url = filters
        ? `/${userId}/recommendations/filters`
        : `/${userId}/new-recommendations`;

      const response = await this.apiClient[method]<ApiResponse<IMovie[]>>(
        url,
        { filters }
      );

      return response.data?.data?.data || [];
    } catch (error) {
      console.error(
        'RealApi.getNewRecommendations: Error getting new recommendations',
        error
      );
      throw error;
    }
  }

  async markAsWatched(
    userId: string,
    movieId: string,
    rating?: number,
    review?: string
  ): Promise<boolean> {
    try {
      const response = await this.apiClient.post<ApiResponse<boolean>>(
        `/${userId}/movie/${movieId}/watched`,
        { rating, review }
      );
      return response.data?.data?.data ?? false;
    } catch (error) {
      console.error('RealApi.markAsWatched: Error marking as watched', error);
      throw error;
    }
  }

  async removeReview(userId: string, movieId: string): Promise<boolean> {
    try {
      console.log(
        'RealApi.removeReview: Removing review for movie',
        movieId,
        userId
      );

      const response = await this.apiClient.delete<ApiResponse<boolean>>(
        `/${userId}/movie/${movieId}/review`
      );
      return response.data?.data?.data ?? false;
    } catch (error) {
      console.error('RealApi.removeReview: Error removing review', error);
      throw error;
    }
  }

  async getUserRating(
    userId: string,
    movieId: string
  ): Promise<IUserMovie | null> {
    try {
      console.log(
        'RealApi.getUserRating: Getting user rating for movie',
        movieId,
        userId
      );

      const response = await this.apiClient.get<ApiResponse<IUserMovie>>(
        `/${userId}/movie/${movieId}/rating`
      );

      console.log(
        'RealApi.getUserRating: User rating',
        response.data?.data?.data
      );
      return response.data?.data?.data ?? null;
    } catch (error) {
      console.error('RealApi.getUserRating: Error getting user rating', error);
      throw error;
    }
  }

  async getGenres(): Promise<IGenre[]> {
    try {
      console.log('RealApi.getGenres: Getting genres');

      const response =
        await this.apiClient.get<ApiResponse<IGenre[]>>('/genres');

      console.log('RealApi.getGenres: Genres', response.data?.data?.data);

      return response.data?.data?.data || [];
    } catch (error) {
      console.error('RealApi.getGenres: Error getting genres', error);
      throw error;
    }
  }

  async getCountries(): Promise<ICountry[]> {
    try {
      console.log('RealApi.getCountries: Getting countries');

      const response =
        await this.apiClient.get<ApiResponse<ICountry[]>>('/countries');

      console.log('RealApi.getCountries: Countries', response.data?.data?.data);

      return response.data?.data?.data || [];
    } catch (error) {
      console.error('RealApi.getCountries: Error getting countries', error);
      throw error;
    }
  }
}

export default RealApi;
