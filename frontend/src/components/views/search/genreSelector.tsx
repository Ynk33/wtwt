import React, { useMemo } from 'react';

import type { IGenre } from '@types';
import AutocompleteTagInput from '@components/ui/autocompleteTagInput/AutocompleteTagInput';
import useGenres from '@hooks/useGenres';
import { cn } from '@utils/cn';

const GenreSelector = ({
  selectedGenres,
  onGenresChange,
  variant = 'primary',
  className,
}: {
  selectedGenres: IGenre[];
  onGenresChange: (genres: IGenre[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}): React.ReactNode => {
  const { genres, isLoading, error } = useGenres();

  // Filter available genres (exclude already selected ones)
  const availableGenres = useMemo(
    () =>
      genres.filter(
        (genre) =>
          !selectedGenres.some((selected) => selected._id === genre._id)
      ),
    [genres, selectedGenres]
  );

  // Transform available genres to AutocompleteDropdown item format
  const availableGenresItems = useMemo(
    () =>
      availableGenres.map((genre) => ({
        key: genre._id,
        label: genre.name,
      })),
    [availableGenres]
  );

  // Convert selected genres to TagItem format for initialTags
  const initialTagItems = useMemo(
    () =>
      selectedGenres.map((genre) => ({
        id: genre._id,
        label: genre.name,
      })),
    [selectedGenres]
  );

  // Handle tags changed - convert labels back to IGenre[]
  const handleTagsChanged = (labels: string[]) => {
    // Find genres that match the labels
    const newSelectedGenres = labels
      .map((label) => genres.find((genre) => genre.name === label))
      .filter((genre): genre is IGenre => genre !== undefined);

    // Update parent with new genres
    onGenresChange(newSelectedGenres);
  };

  if (error) {
    return <div className="text-red-500">Error loading genres: {error}</div>;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <AutocompleteTagInput
        initialTags={initialTagItems}
        onTagsChanged={handleTagsChanged}
        items={availableGenresItems}
        placeholder="Type a genre..."
        disabled={isLoading}
        tagVariant={variant}
      />

      {isLoading && (
        <div className="text-gray-500 text-sm mt-1">Loading genres...</div>
      )}
    </div>
  );
};

export default GenreSelector;
