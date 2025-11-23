import React, { useMemo } from 'react';
import { useSearchStore } from '@stores/SearchStore';

import type { IGenre } from '@types';
import AutocompleteTagInput from '@components/ui/autocompleteTagInput/AutocompleteTagInput';
import useGenres from '@hooks/useGenres';
import { cn } from '@utils/cn';

const GenreSelector = ({
  type = 'included',
  className,
}: {
  type?: 'included' | 'excluded';
  className?: string;
}): React.ReactNode => {
  const { genres: existingGenres, isLoading, error } = useGenres();
  const { genres, setGenres, excludedGenres, setExcludedGenres } =
    useSearchStore();

  const selectedGenres = type === 'included' ? genres : excludedGenres;
  const setSelectedGenres = type === 'included' ? setGenres : setExcludedGenres;

  // Filter available genres (exclude already selected ones)
  const availableGenres = useMemo(
    () =>
      existingGenres.filter(
        (genre) =>
          !selectedGenres.some((selected) => selected._id === genre._id)
      ),
    [existingGenres, selectedGenres]
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
      .map((label) => existingGenres.find((genre) => genre.name === label))
      .filter((genre): genre is IGenre => genre !== undefined);

    // Update parent with new genres
    setSelectedGenres(newSelectedGenres);
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
        tagVariant={type === 'included' ? 'primary' : 'danger'}
      />

      {isLoading && (
        <div className="text-gray-500 text-sm mt-1">Loading genres...</div>
      )}
    </div>
  );
};

export default GenreSelector;
