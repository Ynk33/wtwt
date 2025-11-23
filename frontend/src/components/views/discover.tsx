import React from 'react';

import Error from '@components/commons/error';
import Loader from '@components/ui/Loader';
import MovieGrid from '@components/views/movieGrid';
import useMovies from '@hooks/useMovies';
import useUserId from '@hooks/useUserId';

const Discover = (): React.ReactNode => {
  const userId = useUserId();
  const { movies, isLoading, error, getRecommendations } = useMovies(userId);

  return (
    <div className="relative w-full grow min-h-0 overflow-hidden">
      {isLoading && <Loader />}
      {error && <Error error={error} />}

      {!isLoading && !error && (
        <MovieGrid
          movies={movies}
          onRefreshRecommendations={() => getRecommendations()}
        />
      )}
    </div>
  );
};

export default Discover;
