import type { ICountry, IGenre, IMovie, IMovieApi, IUserMovie } from '@types';

const movies = [
  {
    _id: '1',
    externalIds: {
      tmdbId: 1,
    },
    title: 'Inception',
    posterUrl:
      'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology.',
    genres: ['Science Fiction'],
    year: 2010,
    ratings: {
      tmdb: 8.8,
    },
    directors: [
      {
        _id: '1',
        externalIds: {
          tmdbId: 1,
        },
        name: 'Christopher Nolan',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    cast: [
      {
        _id: '2',
        externalIds: {
          tmdbId: 2,
        },
        name: 'Leonardo DiCaprio',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '3',
        externalIds: {
          tmdbId: 3,
        },
        name: 'Joseph Gordon-Levitt',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '4',
        externalIds: {
          tmdbId: 4,
        },
        name: 'Ellen Page',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    countries: ['United States'],
  },
  {
    _id: '2',
    externalIds: {
      tmdbId: 2,
    },
    title: 'The Shawshank Redemption',
    posterUrl:
      'https://www.themoviedb.org/t/p/w1280/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    description: 'Two imprisoned men bond over a number of years.',
    genres: ['Drama'],
    year: 1994,
    ratings: {
      tmdb: 9.3,
    },
    directors: [
      {
        _id: '3',
        externalIds: {
          tmdbId: 3,
        },
        name: 'Frank Darabont',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    cast: [
      {
        _id: '5',
        externalIds: {
          tmdbId: 5,
        },
        name: 'Tim Robbins',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '6',
        externalIds: {
          tmdbId: 6,
        },
        name: 'Morgan Freeman',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    countries: ['United States'],
  },
  {
    _id: '3',
    externalIds: {
      tmdbId: 3,
    },
    title: 'The Godfather',
    posterUrl:
      'https://www.themoviedb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    description:
      'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
    genres: ['Crime'],
    year: 1972,
    ratings: {
      tmdb: 9.2,
    },
    directors: [
      {
        _id: '4',
        externalIds: {
          tmdbId: 4,
        },
        name: 'Francis Ford Coppola',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    cast: [
      {
        _id: '7',
        externalIds: {
          tmdbId: 7,
        },
        name: 'Marlon Brando',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '8',
        externalIds: {
          tmdbId: 8,
        },
        name: 'Al Pacino',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '9',
        externalIds: {
          tmdbId: 9,
        },
        name: 'James Caan',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    countries: ['United States'],
  },
  {
    _id: '4',
    externalIds: {
      tmdbId: 4,
    },
    title: 'The Matrix',
    posterUrl:
      'https://www.themoviedb.org/t/p/w1280/p96dm7sCMn4VYAStA6siNz30G1r.jpg',
    description:
      'A computer hacker learns about the true nature of his reality and his role in the war.',
    genres: ['Action'],
    year: 1999,
    ratings: {
      tmdb: 8.7,
    },
    directors: [
      {
        _id: '5',
        externalIds: {
          tmdbId: 5,
        },
        name: 'Lana Wachowski',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    cast: [
      {
        _id: '10',
        externalIds: {
          tmdbId: 10,
        },
        name: 'Keanu Reeves',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '11',
        externalIds: {
          tmdbId: 11,
        },
        name: 'Laurence Fishburne',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '12',
        externalIds: {
          tmdbId: 12,
        },
        name: 'Carrie-Anne Moss',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    countries: ['United States'],
  },
  {
    _id: '5',
    externalIds: {
      tmdbId: 5,
    },
    title: 'Pulp Fiction',
    posterUrl:
      'https://www.themoviedb.org/t/p/w1280/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    description:
      'The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence and redemption.',
    genres: ['Crime'],
    year: 1994,
    ratings: {
      tmdb: 8.9,
    },
    directors: [
      {
        _id: '6',
        externalIds: {
          tmdbId: 6,
        },
        name: 'Quentin Tarantino',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    cast: [
      {
        _id: '13',
        externalIds: {
          tmdbId: 13,
        },
        name: 'John Travolta',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '14',
        externalIds: {
          tmdbId: 14,
        },
        name: 'Uma Thurman',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
      {
        _id: '15',
        externalIds: {
          tmdbId: 15,
        },
        name: 'Samuel L. Jackson',
        photoUrl:
          'https://www.themoviedb.org/t/p/w1280/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
      },
    ],
    countries: ['United States'],
  },
];

const genres = [
  {
    _id: '1',
    externalIds: {
      tmdbId: 1,
    },
    name: 'Action',
  },
  {
    _id: '2',
    externalIds: {
      tmdbId: 2,
    },
    name: 'Adventure',
  },
  {
    _id: '3',
    externalIds: {
      tmdbId: 3,
    },
    name: 'Comedy',
  },
  {
    _id: '4',
    externalIds: {
      tmdbId: 4,
    },
    name: 'Drama',
  },
  {
    _id: '5',
    externalIds: {
      tmdbId: 5,
    },
    name: 'Fantasy',
  },
];

const countries = [
  {
    _id: '1',
    name: 'United States',
  },
  {
    _id: '2',
    name: 'United Kingdom',
  },
  {
    _id: '3',
    name: 'Canada',
  },
  {
    _id: '4',
    name: 'Australia',
  },
  {
    _id: '5',
    name: 'France',
  },
];

class MockApi implements IMovieApi {
  async getRecommendations(_userId: string): Promise<IMovie[]> {
    return Promise.resolve(movies);
  }

  async getNewRecommendations(_userId: string): Promise<IMovie[]> {
    return Promise.resolve(movies);
  }

  async getRecommendationsWithFilters(
    _userId: string,
    _filters: {
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
    }
  ): Promise<IMovie[]> {
    return Promise.resolve(movies);
  }

  async removeReview(_userId: string, _movieId: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  async markAsWatched(
    _userId: string,
    _movieId: string,
    _rating?: number,
    _review?: string
  ): Promise<boolean> {
    return Promise.resolve(true);
  }

  async getUserRating(
    _userId: string,
    _movieId: string
  ): Promise<IUserMovie | null> {
    return Promise.resolve({
      _id: '1',
      userId: _userId,
      movieId: _movieId,
      isWatched: true,
      rating: 5,
      review: 'Great movie',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IUserMovie);
  }

  async getGenres(): Promise<IGenre[]> {
    return Promise.resolve(genres);
  }

  async getCountries(): Promise<ICountry[]> {
    return Promise.resolve(countries);
  }
}

export default MockApi;
