import React, { useState } from 'react';

import type { ICountry, IGenre, MovieFilters } from '@types';
import Button from '@components/ui/Button';
import CountrySelector from '@components/views/search/countrySelector';
import GenreSelector from './genreSelector';

const SearchForm = ({
  onSubmit,
}: {
  onSubmit: (filters?: MovieFilters) => void;
}): React.ReactNode => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [excludedGenres, setExcludedGenres] = useState<IGenre[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);

  const validate = () => {};

  const handleSubmit = () => {
    validate();
    onSubmit({ genres: genres.map((genre) => genre.name) });
  };

  return (
    <div>
      <h1>Search</h1>
      <GenreSelector selectedGenres={genres} onGenresChange={setGenres} />
      <GenreSelector
        selectedGenres={excludedGenres}
        onGenresChange={setExcludedGenres}
        variant="danger"
      />
      <CountrySelector
        selectedCountries={countries}
        onCountriesChange={setCountries}
      />
      {/* TODO: add year selector */}
      {/* TODO: add rating selector */}
      {/* TODO: add sort selector */}
      {/* TODO: display errors */}
      <Button onClick={handleSubmit}>Search</Button>
    </div>
  );
};

export default SearchForm;
