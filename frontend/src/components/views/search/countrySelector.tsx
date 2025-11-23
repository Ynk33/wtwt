import React, { useMemo } from 'react';
import { useSearchStore } from '@stores/SearchStore';

import type { ICountry } from '@types';
import AutocompleteTagInput from '@components/ui/autocompleteTagInput/AutocompleteTagInput';
import useCountries from '@hooks/useCountries';
import { cn } from '@utils/cn';

const CountrySelector = ({
  variant = 'primary',
  className,
}: {
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}): React.ReactNode => {
  const { countries: existingCountries, isLoading, error } = useCountries();
  const { countries, setCountries } = useSearchStore();

  // Filter available countries (exclude already selected ones)
  const availableCountries = useMemo(
    () =>
      existingCountries.filter(
        (country) => !countries.some((selected) => selected._id === country._id)
      ),
    [existingCountries, countries]
  );

  // Transform available countries to AutocompleteDropdown item format
  const availableCountriesItems = useMemo(
    () =>
      availableCountries.map((country) => ({
        key: country._id,
        label: country.name,
      })),
    [availableCountries]
  );

  // Convert selected countries to TagItem format for initialTags
  const initialTagItems = useMemo(
    () =>
      countries.map((country) => ({
        id: country._id,
        label: country.name,
      })),
    [countries]
  );

  // Handle tags changed - convert labels back to ICountry[]
  const handleTagsChanged = (labels: string[]) => {
    // Find countries that match the labels
    const newSelectedCountries = labels
      .map((label) =>
        existingCountries.find((country) => country.name === label)
      )
      .filter((country): country is ICountry => country !== undefined);

    // Update parent with new countries
    setCountries(newSelectedCountries);
  };

  if (error) {
    return <div className="text-red-500">Error loading countries: {error}</div>;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <AutocompleteTagInput
        initialTags={initialTagItems}
        onTagsChanged={handleTagsChanged}
        items={availableCountriesItems}
        placeholder="Type a country..."
        disabled={isLoading}
        tagVariant={variant}
      />

      {isLoading && (
        <div className="text-gray-500 text-sm mt-1">Loading countries...</div>
      )}
    </div>
  );
};

export default CountrySelector;
