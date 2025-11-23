import { ObjectId, UpdateResult } from 'mongodb';

import {
  CountryResponse,
  GenreResponse,
  IMovieDbService,
  Movie,
  MovieFilters,
  MovieResponse,
  PeopleResponse,
  UserMovie,
  UserMoviesWatched,
} from '@types';
import countryDb from '@database/countryDb';
import genreDb from '@database/genreDb';
import movieDb from '@database/movieDb';
import peopleDb from '@database/peopleDb';
import userMovieDb from '@database/userMovieDb';
import tmdbApi from '@services/movieApi/tmdbApi';

class MovieService implements IMovieDbService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  /**
   * @description Gets a movie by its ID from the database
   * @param {ObjectId} movieId - The ID of the movie
   * @returns {Promise<MovieResponse | null>} The movie response or null if no movie is found
   * @memberof MovieService
   */
  async getMovieById(movieId: ObjectId): Promise<MovieResponse | null> {
    console.log('MovieService.getMovieById: getting movie by ID', { movieId });

    const movie = await movieDb.getMovieById(movieId);
    if (movie) {
      console.log('MovieService.getMovieById: movie found in database', {
        movieId,
      });
      return await this.format(movie);
    }

    console.warn('MovieService.getMovieById: movie not found in database', {
      movieId,
    });
    return null;
  }

  /**
   * @description Gets movies from the database that match the filters
   * @param {Object} filters - The filters to apply to the movies
   * @param {Array<string>} filters.ids - The IDs of the movies to get
   * @param {Array<string>} filters.genres - The genres of the movies to get
   * @param {Array<string>} filters.countries - The countries of the movies to get
   * @param {Object} filters.years - The years of the movies to get
   * @param {number} filters.years.min - The minimum year of the movies to get
   * @param {number} filters.years.max - The maximum year of the movies to get
   * @param {Object} filters.ratings - The ratings of the movies to get
   * @param {number} filters.ratings.min - The minimum rating of the movies to get
   * @param {number} filters.ratings.max - The maximum rating of the movies to get
   * @returns {Promise<Array<MovieResponse>>} The movies that match the filters
   * @memberof MovieService
   */
  async getMovies(
    filters: MovieFilters & { ids?: Array<string> },
    limit?: number
  ): Promise<Array<MovieResponse>> {
    console.log('MovieService.getMovies: getting movies with filters', {
      filters: {
        ids: filters.ids?.length ?? 0,
        genres: filters.genres?.length ?? 0,
        countries: filters.countries?.length ?? 0,
        years: filters.years
          ? {
              min: filters.years.min,
              max: filters.years.max,
            }
          : undefined,
        ratings: filters.ratings
          ? {
              min: filters.ratings.min,
              max: filters.ratings.max,
            }
          : undefined,
      },
    });

    const movies = await movieDb.getMovies(filters, limit);

    console.log('MovieService.getMovies: movies found', {
      count: movies.length,
    });

    const formattedMovies = await Promise.all(
      movies.map((m) => this.format(m))
    );

    return formattedMovies;
  }

  /**
   * @description Gets the genres from the database
   * @returns {Promise<GenreResponse[]>} The genres
   */
  async getGenres(): Promise<GenreResponse[]> {
    console.log('MovieService.getGenres: getting genres');

    const genres = await genreDb.getGenres();

    return genres.map((g) => ({
      _id: g._id.toString(),
      externalIds: g.externalIds,
      name: g.name,
    }));
  }

  /**
   * @description Gets the countries from the database
   * @returns {Promise<CountryResponse[]>} The countries
   */
  async getCountries(): Promise<CountryResponse[]> {
    console.log('MovieService.getCountries: getting countries');

    const countries = await countryDb.getCountries();

    return countries.map((c) => ({
      _id: c._id.toString(),
      name: c.english_name,
    }));
  }

  /**
   * @description Searches for a movie by title in the database and the TMDB API.
   * @param {string} title - The title of the movie to search for
   * @returns {Promise<MovieResponse | null>} The movie response or null if no movie is found
   */
  async search(title: string, year?: number): Promise<MovieResponse | null> {
    console.log('MovieService.searchMovie: searching movie by title and year', {
      title,
      year,
    });

    // 1. Search the database for the movie with the title
    const existingByTitle = await movieDb.findMovie({ title, year });
    if (existingByTitle) {
      console.log('MovieService.searchMovie: movie found in database', {
        title,
      });
      return await this.format(existingByTitle);
    }

    // 2. Search the TMDB API for the movie ID
    const tmdbMovieId = await tmdbApi.search(title, year);
    if (!tmdbMovieId) {
      console.log(
        'MovieService.searchMovie: no movie found in database or TMDB API',
        { title }
      );
      return null;
    }

    // 3. Search the database for the movie with the TMDB ID
    const existingByTmdbId = await movieDb.findMovie({
      externalIds: { tmdbId: tmdbMovieId },
    });
    if (existingByTmdbId) {
      console.log(
        'MovieService.searchMovie: movie found in database with TMDB ID',
        { title, tmdbMovieId }
      );
      return await this.format(existingByTmdbId);
    }

    // 4. Search the TMDB API for the movie
    const tmdbMovie = await tmdbApi.searchById(tmdbMovieId);
    if (tmdbMovie) {
      console.log('MovieService.searchMovie: movie found in TMDB API', {
        title,
        tmdbMovieId,
      });
      const result = await this.syncMovie(tmdbMovie, title);
      if (result.upsertedCount > 0) {
        tmdbMovie._id = result.upsertedId!.toString();
      }
      return tmdbMovie;
    }

    console.log(
      'MovieService.searchMovie: no movie found in database or TMDB API',
      { title }
    );
    return null;
  }

  /**
   * @description Searches for a movie by title and year in the TMDB API
   * @param title - The title of the movie to search for
   * @param year - The year of the movie to search for
   * @returns {Promise<MovieResponse | null>} The movie response or null if no movie is found
   * @memberof MovieService
   */
  async simpleSearch(
    title: string,
    year: number | undefined
  ): Promise<MovieResponse | null> {
    console.log(
      'MovieService.simpleSearchMovie: searching movie by title and year',
      {
        title,
        year,
      }
    );

    const tmdbId = await tmdbApi.search(title, year);
    if (!tmdbId) {
      console.log(
        'MovieService.simpleSearchMovie: no movie found in TMDB API',
        {
          title,
          year,
        }
      );
      return null;
    }
    const tmdbMovie = await tmdbApi.searchById(tmdbId.toString());
    if (tmdbMovie) {
      console.log('MovieService.simpleSearchMovie: movie found in TMDB API', {
        title,
        year,
      });
      return tmdbMovie;
    }
    return null;
  }

  /**
   * @description Gets the latest watched movies for a user
   * @param {Object} params - The parameters to get the favorite movies
   * @param {ObjectId} params.userId - The ID of the user
   * @param {MovieFilters} params.filters - The filters to apply to the movies
   * @param {number} params.limit - The number of movies to return
   * @returns {Promise<Array<UserMoviesWatched>>} The favorite movies of the user
   */
  async getFavoriteMovies({
    userId,
    filters,
    limit,
  }: {
    userId: ObjectId;
    filters?: MovieFilters;
    limit: number;
  }): Promise<Array<UserMoviesWatched>> {
    console.log(
      'MovieService.getFavoriteMovies: getting favorite movies of user',
      { userId, filters, limit }
    );

    const userRatings = await userMovieDb.getFavoriteMovies(userId, limit);

    console.log('MovieService.getFavoriteMovies: user ratings found', {
      count: userRatings.length,
    });

    const favoriteMovies = await this.getMovies(
      {
        ids: userRatings.map((ur) => ur.movieId.toString()),
        ...filters,
      },
      limit
    );

    console.log('MovieService.getFavoriteMovies: movies found', {
      count: favoriteMovies.length,
    });

    const response = userRatings
      .map((ur) => {
        const movie = favoriteMovies.find(
          (m) => m._id!.toString() === ur.movieId.toString()
        );
        return {
          title: movie?.title,
          year: movie?.year,
          rating: ur.rating,
          review: ur.review,
        } as UserMoviesWatched;
      })
      .filter(Boolean);

    console.log('MovieService.getFavoriteMovies: response', {
      count: response.length,
      movies: response.map((r) => `${r.title} (${r.year})`),
    });

    return response;
  }

  /**
   * @description Marks a movie as watched for a user
   * @param userId - The ID of the user
   * @param movieId - The ID of the movie
   * @param rating - The rating of the movie
   * @param review - The review of the movie
   * @returns {Promise<void>} void
   */
  async markAsWatched(
    userId: ObjectId,
    movieId: ObjectId,
    rating?: number,
    review?: string
  ): Promise<void> {
    await userMovieDb.rateMovie(userId, movieId, rating, review);
  }

  /**
   * @description Remove a review made by the user for a movie
   * @param userId - The ID of the user
   * @param movieId - The ID of the movie
   * @returns {Promise<boolean>} Whether a review has been removed or not
   */
  async removeReview(userId: ObjectId, movieId: ObjectId): Promise<boolean> {
    console.log('MovieService.removeReview', { userId, movieId });
    const result = await userMovieDb.removeReview(userId, movieId);

    console.log('MovieService.removeReview: result', {
      userId,
      movieId,
      result,
    });

    return result.deletedCount > 0;
  }

  /**
   * @description Gets a user's rating for a movie
   * @param {ObjectId} userId - The ID of the user
   * @param {ObjectId} movieId - The ID of the movie
   * @returns {Promise<UserMovie | null>} The user's rating or null if no rating is found
   */
  async getUserRating(
    userId: ObjectId,
    movieId: ObjectId
  ): Promise<UserMovie | null> {
    console.log('MovieService.getUserRating: getting user rating for movie', {
      userId,
      movieId,
    });

    const rating = await userMovieDb.getRating(userId, movieId);

    console.log('MovieService.getUserRating: user rating found', { rating });
    return rating;
  }

  /**
   * @description Formats a movie from the database to a movie response and hydrate the director and cast
   * from the people collection
   * @param {Movie} movie - The movie to format
   * @returns {Promise<MovieResponse>} The movie response
   */
  async format(movie: Movie): Promise<MovieResponse> {
    const directors: Array<PeopleResponse> = [];
    const cast: Array<PeopleResponse> = [];

    if (movie.directors) {
      const directorsDb = await peopleDb.findWithIds(movie.directors);

      directorsDb.forEach((director) => {
        directors.push({
          _id: director._id!.toString(),
          externalIds: director.externalIds,
          name: director.name,
          photoUrl: director.photoUrl,
        } as PeopleResponse);
      });
    }

    if (movie.cast) {
      const castDb = await peopleDb.findWithIds(movie.cast);

      castDb.forEach((person) => {
        cast.push({
          _id: person._id.toString(),
          externalIds: person.externalIds,
          name: person.name,
          photoUrl: person.photoUrl,
        });
      });
    }

    return {
      _id: movie._id.toString(),
      externalIds: movie.externalIds,
      title: movie.title,
      posterUrl: movie.posterUrl,
      description: movie.description,
      genres: movie.genres,
      year: movie.year,
      ratings: {
        tmdb: movie.ratings.tmdb,
      },
      directors,
      cast,
      countries: movie.countries,
    };
  }

  /**
   * @description Syncs a movie from the TMDB API to the database and hydrates the director and cast
   * from the people collection
   * @param {MovieResponse} movie - The movie to sync
   * @returns {Promise<UpdateResult<Movie>>} The update result
   */
  async syncMovie(
    movie: MovieResponse,
    alternativeTitle: string
  ): Promise<UpdateResult<Movie>> {
    console.log('MovieService.syncMovie: syncing movie', {
      movie: movie.title,
    });

    const result = await movieDb.sync(movie, alternativeTitle);

    console.log('MovieService.syncMovie: movie upserted', {
      result,
    });
    return result;
  }

  /**
   * @description Pulls the genres from the TMDB API and inserts them into the database
   * @returns {Promise<void>} void
   */
  async syncGenres(): Promise<void> {
    console.log('MovieService.pullGenres: pulling genres');

    const genres = await tmdbApi.getGenres();

    console.log('MovieService.pullGenres: genres', { genres });
    if (!genres || genres.length === 0) {
      console.log('MovieService.pullGenres: no genres found');
      return;
    }

    const result = await genreDb.sync(genres);

    console.log('MovieService.pullGenres: genres upserted', { result });
  }

  async syncCountries(): Promise<void> {
    console.log('MovieService.syncCountries: syncing countries');

    const countries = await tmdbApi.getCountries();

    console.log('MovieService.syncCountries: countries', { countries });
    if (!countries || countries.length === 0) {
      console.log('MovieService.syncCountries: no countries found');
      return;
    }

    const result = await countryDb.sync(countries);

    console.log('MovieService.syncCountries: countries upserted', { result });
  }
}

const instance = new MovieService();
export default instance;
