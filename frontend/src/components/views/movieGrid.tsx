import React, { useState } from 'react';

import type { IMovie } from '@types';
import MovieCard from '@components/commons/movieCard';
import Grid from '@components/layouts/grid';
import Button from '@components/ui/Button';
import MovieModal from '@components/views/movieModal';

const MovieGrid = ({
  movies,
  onRefreshRecommendations,
}: {
  movies: IMovie[];
  onRefreshRecommendations?: () => void;
}): React.ReactNode => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);

  return (
    <>
      <Grid>
        {movies.length > 0 &&
          movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onClick={() => {
                setSelectedMovie(movie);
                setIsModalOpen(true);
              }}
            />
          ))}
      </Grid>

      {onRefreshRecommendations && (
        <div className="absolute top-0 right-0 p-2">
          <Button variant="tertiary" onClick={onRefreshRecommendations}>
            Refresh Recommendations
          </Button>
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          movie={selectedMovie}
        />
      )}
    </>
  );
};

export default MovieGrid;
