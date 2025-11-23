import axios from 'axios';

import {
  GenreResponse,
  IMovieApiService,
  MovieResponse,
  TMDBCountry,
  TMDBGenres,
  TMDBMovieCredits,
  TMDBMovieDetails,
  TMDBMovieSearchResult,
} from '@types';

class TMDBApi implements IMovieApiService {
  private readonly apiKey: () => string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = () => process.env.TMDB_API_KEY || '';
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  /**
   * @description Calls the TMDB API and returns the data
   * @param {string} path - The path of the API to call
   * @param {Record<string, any>} params - The parameters to pass to the API
   * @returns {Promise<T>} The data from the API
   * @throws {Error} If the API call fails
   */
  async callApi<T>(
    path: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}/${path}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey()}`,
        },
        params,
      });
      return response.data as T;
    } catch (err) {
      console.error('TMDBApi.callApi: Error calling API', err);
      throw err;
    }
  }

  /**
   * @description Uses the TMDB API to search for a movie by title and return the TMDB ID
   * @param {string} title - The title of the movie to search for
   * @param {number} year - The year of the movie to search for
   * @returns {Promise<string | null>} The TMDB ID of the movie or null if no movie is found
   */
  async search(title: string, year?: number): Promise<string | null> {
    try {
      const response = await this.callApi<TMDBMovieSearchResult>(
        'search/movie',
        {
          query: title,
          year: year?.toString(),
        }
      );

      response.results.sort((a, b) => b.popularity - a.popularity);

      const tmdbId = response.results[0]?.id;
      if (!tmdbId) {
        console.log('TMDBApi.simpleSearchMovie: No movie found');
        return null;
      }

      return tmdbId.toString();
    } catch (error) {
      console.error('TMDBApi.simpleSearchMovie: Error searching movie', error);
      return null;
    }
  }

  /**
   * Search for a movie by TMDB ID
   * @description Uses the TMDB API to search for a movie by TMDB ID
   * @param tmdbId - The TMDB ID of the movie
   * @returns {Promise<MovieResponse | null>} The movie response or null if no movie is found
   */
  async searchById(id: string): Promise<MovieResponse | null> {
    try {
      return await this.getMovie(Number(id));
    } catch (error) {
      console.error('TMDBApi.searchMovieById: Error searching movie', error);
      return null;
    }
  }

  /**
   * @description Uses the TMDB API to get a movie by TMDB ID
   * @param {number} tmdbId - The TMDB ID of the movie
   * @returns {Promise<MovieResponse | null>} The movie response or null if no movie is found
   */
  private async getMovie(tmdbId: number): Promise<MovieResponse | null> {
    try {
      const details = await this.callApi<TMDBMovieDetails>(`movie/${tmdbId}`);
      const credits = await this.callApi<TMDBMovieCredits>(
        `movie/${tmdbId}/credits`
      );

      const directorsCrew = credits.crew.filter(
        (crew) => crew.department === 'Directing' && crew.job === 'Director'
      );
      const directors = directorsCrew
        ? directorsCrew.map((director) => {
            return {
              externalIds: {
                tmdbId: director.id,
              },
              name: director.name,
              photoUrl: director.profile_path
                ? `https://image.tmdb.org/t/p/w500${director.profile_path}`
                : '',
            };
          })
        : [];

      const cast = credits.cast.slice(0, 5).map((actor) => {
        return {
          externalIds: {
            tmdbId: actor.id,
          },
          name: actor.name,
          photoUrl: actor.profile_path
            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
            : '',
        };
      });

      return {
        externalIds: {
          tmdbId: details.id,
        },
        title: details.title,
        posterUrl: details.poster_path
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : '',
        description: details.overview,
        genres: details.genres.map((genre) => genre.name),
        year: details.release_date
          ? new Date(details.release_date).getFullYear()
          : 0,
        ratings: {
          tmdb: details.vote_average,
        },
        directors,
        cast,
        countries: details.production_countries.map((country) => country.name),
      };
    } catch (error) {
      console.error('TMDBApi.getMovie: Error getting movie', error);
      return null;
    }
  }

  /**
   * @description Gets the genres from the TMDB API
   * @returns {Promise<GenreResponse[] | null>} The genres or null if an error occurs
   */
  async getGenres(): Promise<GenreResponse[] | null> {
    try {
      const response = await this.callApi<TMDBGenres>('genre/movie/list');
      return response.genres.map((genre) => {
        return {
          externalIds: {
            tmdbId: genre.id,
          },
          name: genre.name,
        };
      });
    } catch (error) {
      console.error('TMDBApi.getGenres: Error getting genres', error);
      return null;
    }
  }

  /**
   * @description Gets the countries from the TMDB API
   * @returns {Promise<TMDBCountry[] | null>} The countries or null if an error occurs
   */
  async getCountries(): Promise<TMDBCountry[] | null> {
    try {
      const response = await this.callApi<TMDBCountry[]>(
        'configuration/countries'
      );
      return response;
    } catch (error) {
      console.error('TMDBApi.getCountries: Error getting countries', error);
      return null;
    }
  }
}

const tmdbApi = new TMDBApi();
export default tmdbApi;
