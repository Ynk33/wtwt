import React from 'react';

import Error from '@components/commons/error';
import Loader from '@components/ui/Loader';
import MovieGrid from '@components/views/movieGrid';
import useMovies from '@hooks/useMovies';
import useUserId from '@hooks/useUserId';
import SearchForm from './search/searchForm';

// TODO: find a way to keep the search filters and search results for the current session
const Search = (): React.ReactNode => {
  const userId = useUserId();
  const { movies, isLoading, error, getRecommendations } = useMovies(
    userId,
    false
  );

  return (
    <div className="relative w-full grow min-h-0 overflow-hidden">
      <SearchForm onSubmit={getRecommendations} />

      {isLoading && <Loader />}
      {error && <Error error={error} />}

      {!isLoading && !error && <MovieGrid movies={movies} />}
    </div>
  );
};

export default Search;
