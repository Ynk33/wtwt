import React from 'react';

import type { IMovie } from '@types';
import Section from '@components/ui/Section';
import MovieDetailEntry from '@components/views/movieDetails/movieDetailEntry';
import RateMe from '@components/views/rateMe/rateMe';
import { shortName } from '@utils/utils';

const MovieDetails = ({ movie }: { movie: IMovie }): React.ReactNode => {
  return (
    <div className="flex flex-col gap-8 pl-2 pr-8 h-full overflow-hidden">
      <div>
        <div className="flex justify-between items-center w-full pr-8">
          <h1 className="text-5xl font-bold">{movie.title}</h1>
          <span className="text-2xl font-bold">
            {movie.ratings.tmdb?.toPrecision(2)}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span>{movie.year}</span>-<span>{movie.genres.join(', ')}</span>
        </div>
      </div>

      <RateMe movieId={movie._id} />

      <Section className="flex flex-col gap-8 overflow-scroll h-full">
        <MovieDetailEntry title="Synopsis" value={movie.description} />
        <MovieDetailEntry
          title={movie.countries.length > 1 ? 'Countries' : 'Country'}
          value={movie.countries.map((c) => shortName(c)).join(', ')}
        />
        <MovieDetailEntry
          title="Directed by"
          value={movie.directors.map((d) => d.name).join(', ')}
        />
        <MovieDetailEntry
          title="Cast"
          value={movie.cast.map((c) => c.name).join(', ')}
        />
        {movie.reason && (
          <MovieDetailEntry
            title="Why this recommendation?"
            value={movie.reason}
          />
        )}
      </Section>
    </div>
  );
};

export default MovieDetails;
