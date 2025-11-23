import React from 'react';
import { useSearchStore } from '@stores/SearchStore';

import type { MovieFilters } from '@types';
import Button from '@components/ui/Button';
import CountrySelector from '@components/views/search/countrySelector';
import GenreSelector from '@components/views/search/genreSelector';
import RatingSelector from '@components/views/search/ratingSelector';
import YearSelector from '@components/views/search/yearSelector';

const SearchForm = ({
  onSubmit,
}: {
  onSubmit: (filters?: MovieFilters) => void;
}): React.ReactNode => {
  const { getMovieFilters } = useSearchStore();

  const validate = () => {
    // TODO: to implement validation for the filters
  };

  const handleSubmit = () => {
    validate();
    const filters = getMovieFilters();
    onSubmit(filters);
  };

  return (
    <div>
      <h1>Search</h1>
      <GenreSelector type="included" />
      <GenreSelector type="excluded" />
      <CountrySelector />
      <YearSelector />
      <RatingSelector />
      {/* TODO: display errors */}
      <Button onClick={handleSubmit}>Search</Button>
    </div>
  );
};

export default SearchForm;
