import React, { useCallback, useMemo, useRef, useState } from 'react';

import AutocompleteDropdown, {
  type DropdownItem,
} from '@components/ui/autocompleteTagInput/AutocompleteDropdown';
import TagInput, {
  type TagInputHandle,
  type TagItem,
} from '@components/ui/TagInput';

interface AutocompleteTagInputProps {
  initialTags: TagItem[];
  onTagsChanged?: (labels: string[]) => void;
  items: DropdownItem[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  tagVariant?: 'default' | 'primary' | 'secondary' | 'danger';
  maxHeight?: string;
  autoShowOnFocus?: boolean;
}

/**
 * Combined component that integrates TagInput with AutocompleteDropdown
 * Handles keyboard navigation, focus, and click outside logic
 * Manages tag state internally and synchronizes with TagInput
 */
const AutocompleteTagInput = ({
  initialTags,
  onTagsChanged,
  items,
  placeholder,
  disabled = false,
  className,
  tagVariant = 'primary',
  maxHeight = 'max-h-60',
  autoShowOnFocus = true,
}: AutocompleteTagInputProps): React.ReactNode => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [existingLabels, setExistingLabels] = useState<Set<string>>(
    new Set(initialTags.map((tag) => tag.label))
  );
  const tagInputRef = useRef<TagInputHandle>(null);

  // Create a ref-like object for AutocompleteDropdown that points to the input element
  const inputRef = useRef<HTMLElement | null>(null);

  // Update inputRef when tagInputRef changes
  React.useEffect(() => {
    inputRef.current = tagInputRef.current?.inputElement || null;
  });

  // Filter items based on input value (filter on label/name property)
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [items, inputValue]
  );

  // Handle tags changed from TagInput
  const handleTagsChanged = useCallback(
    (labels: string[]) => {
      // Update set of existing labels
      setExistingLabels(new Set(labels));

      // Notify parent
      if (onTagsChanged) {
        onTagsChanged(labels);
      }
    },
    [onTagsChanged]
  );

  // Handle input change from TagInput
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  }, []);

  // Handle focus - show suggestions if there are items
  const handleFocus = useCallback(() => {
    if (autoShowOnFocus && (inputValue || filteredItems.length > 0)) {
      setShowSuggestions(true);
    }
  }, [autoShowOnFocus, inputValue, filteredItems.length]);

  // Create a tag from a dropdown item
  const createTagFromDropdown = useCallback(
    (item: DropdownItem) => {
      // Check if tag already exists
      const label = item.label;
      if (existingLabels.has(label)) {
        return; // Tag already exists
      }

      // Use TagInput's createTag method to create the tag programmatically
      if (tagInputRef.current) {
        tagInputRef.current.createTag(label);
        tagInputRef.current.clearInput();
      }
    },
    [existingLabels]
  );

  // Handle item selection from dropdown
  const handleSelectItem = useCallback(
    (item: DropdownItem) => {
      createTagFromDropdown(item);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      // Focus will remain on input (handled by TagInput)
    },
    [createTagFromDropdown]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Intercept Enter to select from dropdown instead of creating free tag
        if (showSuggestions) {
          if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
            handleSelectItem(filteredItems[highlightedIndex]);
          }
        }
        // If dropdown is closed or no items, do nothing (don't create free tag)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        setShowSuggestions(true);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    },
    [showSuggestions, highlightedIndex, filteredItems, handleSelectItem]
  );

  // Handle dropdown close
  const handleClose = useCallback(() => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, []);

  return (
    <div className="relative w-full">
      <TagInput
        ref={tagInputRef}
        initialTags={initialTags}
        onTagsChanged={handleTagsChanged}
        onInputChange={handleInputChange}
        onInputKeyDown={handleKeyDown}
        onInputFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        tagVariant={tagVariant}
      />

      <AutocompleteDropdown
        items={filteredItems}
        onSelect={handleSelectItem}
        highlightedIndex={highlightedIndex}
        isOpen={showSuggestions}
        onClose={handleClose}
        inputRef={inputRef}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default AutocompleteTagInput;
