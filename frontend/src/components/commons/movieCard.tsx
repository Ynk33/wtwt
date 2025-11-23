import React from 'react';

import type { IMovie } from '@types';

const MovieCard = ({
  movie,
  onClick,
}: {
  movie: IMovie;
  onClick: () => void;
}): React.ReactNode => {
  return (
    <div
      className="w-full h-auto aspect-2/3 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MovieCard;
