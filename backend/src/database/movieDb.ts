import { ObjectId } from 'mongodb';

import { Movie, MovieFilters, MovieResponse, PeopleResponse } from '@types';
import AbstractModelDb from '@database/abstractModelDb';
import peopleDb from '@database/peopleDb';

class MovieDb extends AbstractModelDb<Movie> {
  protected getCollectionName(): string {
    return 'movies';
  }

  public async getMovieById(movieId: ObjectId) {
    return this.collection.findOne({ _id: movieId });
  }

  public async getMovies(
    filters: MovieFilters & { ids?: Array<string> },
    limit?: number
  ) {
    const selector = {
      ...(filters.ids
        ? { _id: { $in: filters.ids.map((id) => new ObjectId(id)) } }
        : {}),
      ...(filters.genres ? { genres: { $in: filters.genres } } : {}),
      ...(filters.countries ? { countries: { $in: filters.countries } } : {}),
      ...(filters.years
        ? { year: { $gte: filters.years.min, $lte: filters.years.max } }
        : {}),
      ...(filters.ratings
        ? {
            'ratings.tmdb': {
              $gte: filters.ratings.min,
              $lte: filters.ratings.max,
            },
          }
        : {}),
    };
    let query = this.collection.find(selector);
    if (limit) {
      query = query.limit(limit);
    }

    return query.toArray();
  }

  public async findMovie({
    title,
    externalIds,
    year,
  }: {
    title?: string;
    externalIds?: { tmdbId?: string };
    year?: number;
  }) {
    const selector = {
      ...(title ? { $or: [{ title }, { alternativeTitles: title }] } : {}),
      ...(externalIds ? { externalIds } : {}),
      ...(year ? { year } : {}),
    };
    return this.collection.findOne(selector);
  }

  public async sync(movie: MovieResponse, alternativeTitle: string) {
    await peopleDb.sync([...movie.directors, ...movie.cast]);

    const movieCrewMap = new Map<number, PeopleResponse>();
    movie.directors.forEach((director) => {
      movieCrewMap.set(director.externalIds.tmdbId!, director);
    });
    movie.cast.forEach((person) => {
      movieCrewMap.set(person.externalIds.tmdbId!, person);
    });

    const people = await peopleDb.findWithTmdbIds(
      Array.from(movieCrewMap.keys())
    );

    console.log('MovieDb.sync: people found', {
      people: people.map((p) => p.name),
    });

    const peopleIdsMap = new Map<number, ObjectId>(
      people.map((person) => [person.externalIds.tmdbId!, person._id])
    );

    const movieToUpsert = {
      externalIds: movie.externalIds,
      title: movie.title,
      alternativeTitles:
        alternativeTitle && alternativeTitle !== movie.title
          ? [alternativeTitle]
          : [],
      posterUrl: movie.posterUrl,
      description: movie.description,
      genres: movie.genres,
      year: movie.year,
      ratings: movie.ratings,
      directors: movie.directors
        .map((director) =>
          director.externalIds.tmdbId
            ? peopleIdsMap.get(director.externalIds.tmdbId)
            : undefined
        )
        .filter(Boolean),
      cast: movie.cast
        .map((person) =>
          person.externalIds.tmdbId
            ? peopleIdsMap.get(person.externalIds.tmdbId)
            : undefined
        )
        .filter(Boolean),
      countries: movie.countries,
    };

    console.log('MovieDb.sync: movie to upsert', { movieToUpsert });

    return this.collection.updateOne(
      { externalIds: movie.externalIds },
      {
        $set: {
          ...movieToUpsert,
          updatedAt: new Date(),
        } as Partial<Movie>,
        $setOnInsert: {
          _id: new ObjectId(),
          createdAt: new Date(),
        } as Partial<Movie>,
      },
      { upsert: true }
    );
  }
}

const instance = new MovieDb();
export default instance;
