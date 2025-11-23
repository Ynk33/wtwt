import React, { useMemo } from 'react';

import type { ICountry } from '@types';
import AutocompleteTagInput from '@components/ui/autocompleteTagInput/AutocompleteTagInput';
import useCountries from '@hooks/useCountries';
import { cn } from '@utils/cn';

const CountrySelector = ({
  selectedCountries,
  onCountriesChange,
  variant = 'primary',
  className,
}: {
  selectedCountries: ICountry[];
  onCountriesChange: (countries: ICountry[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}): React.ReactNode => {
  const { countries, isLoading, error } = useCountries();

  // Filter available countries (exclude already selected ones)
  const availableCountries = useMemo(
    () =>
      countries.filter(
        (country) =>
          !selectedCountries.some((selected) => selected._id === country._id)
      ),
    [countries, selectedCountries]
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
      selectedCountries.map((country) => ({
        id: country._id,
        label: country.name,
      })),
    [selectedCountries]
  );

  // Handle tags changed - convert labels back to ICountry[]
  const handleTagsChanged = (labels: string[]) => {
    // Find countries that match the labels
    const newSelectedCountries = labels
      .map((label) => countries.find((country) => country.name === label))
      .filter((country): country is ICountry => country !== undefined);

    // Update parent with new countries
    onCountriesChange(newSelectedCountries);
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
