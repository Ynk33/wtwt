import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { cn } from '@utils/cn';
import Tag from './Tag';

export interface TagItem {
  id: string | number;
  label: string;
}

export interface TagInputHandle {
  createTag: (label: string) => void;
  clearInput: () => void;
  focus: () => void;
  blur: () => void;
  inputElement: HTMLInputElement | null;
}

interface TagInputProps {
  initialTags?: TagItem[];
  onTagsChanged?: (labels: string[]) => void;
  separator?: string;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputFocus?: () => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  tagVariant?: 'default' | 'primary' | 'secondary' | 'danger';
}

/**
 * Reusable input component with integrated tags
 * Manages its own state internally (uncontrolled mode)
 */
const TagInput = React.forwardRef<TagInputHandle, TagInputProps>(
  (
    {
      initialTags = [],
      onTagsChanged,
      separator,
      onInputKeyDown,
      onInputFocus,
      onInputChange,
      placeholder,
      disabled = false,
      className,
      tagVariant = 'primary',
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const nextIdRef = useRef<number>(0);

    // Initialize nextIdRef based on initialTags (only on mount)
    const initializeNextId = () => {
      if (initialTags.length > 0) {
        const maxId = initialTags.reduce((max, tag) => {
          const numId =
            typeof tag.id === 'number' ? tag.id : parseInt(String(tag.id), 10);
          return isNaN(numId) ? max : Math.max(max, numId);
        }, 0);
        nextIdRef.current = maxId + 1;
      }
    };

    // Internal state
    const [tags, setTags] = useState<TagItem[]>(() => {
      initializeNextId();
      return initialTags;
    });
    const [inputValue, setInputValue] = useState('');

    // Generate unique ID for new tags
    const generateId = useCallback((): number => {
      return nextIdRef.current++;
    }, []);

    // Notify parent of tag changes
    const notifyTagsChanged = useCallback(
      (newTags: TagItem[]) => {
        if (onTagsChanged) {
          onTagsChanged(newTags.map((tag) => tag.label));
        }
      },
      [onTagsChanged]
    );

    // Create a new tag from text
    const createTag = useCallback(
      (label: string) => {
        const trimmedLabel = label.trim();
        if (trimmedLabel === '') {
          return;
        }

        const newTag: TagItem = {
          id: generateId(),
          label: trimmedLabel,
        };

        setTags((prevTags) => {
          const newTags = [...prevTags, newTag];
          notifyTagsChanged(newTags);
          return newTags;
        });
      },
      [generateId, notifyTagsChanged]
    );

    // Remove a tag by ID
    const removeTag = useCallback(
      (tagId: string | number) => {
        setTags((prevTags) => {
          const newTags = prevTags.filter((tag) => tag.id !== tagId);
          notifyTagsChanged(newTags);
          return newTags;
        });
      },
      [notifyTagsChanged]
    );

    // Expose methods and input ref to parent
    useImperativeHandle(
      ref,
      () => ({
        createTag,
        clearInput: () => {
          setInputValue('');
          if (onInputChange) {
            onInputChange('');
          }
        },
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        get inputElement() {
          return inputRef.current;
        },
      }),
      [createTag, onInputChange]
    );

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    // Handle input value change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Notify parent if callback provided
      if (onInputChange) {
        onInputChange(value);
      }

      // Handle separator if defined
      if (separator && value.includes(separator)) {
        const separatorIndex = value.indexOf(separator);
        const textBeforeSeparator = value.substring(0, separatorIndex).trim();
        const textAfterSeparator = value.substring(separatorIndex + 1);

        if (textBeforeSeparator) {
          createTag(textBeforeSeparator);
          setInputValue(textAfterSeparator);
          // Also notify parent with the new value after separator
          if (onInputChange) {
            onInputChange(textAfterSeparator);
          }
        } else {
          // If nothing before separator, just remove the separator
          setInputValue(textAfterSeparator);
          if (onInputChange) {
            onInputChange(textAfterSeparator);
          }
        }
      }
    };

    // Handle Backspace to remove last tag
    const handleBackspace = (
      e: React.KeyboardEvent<HTMLInputElement>
    ): boolean => {
      if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        e.preventDefault();
        removeTag(tags[tags.length - 1].id);
        return true; // Handled
      }
      return false; // Not handled
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Backspace to remove last tag (internal logic)
      const handled = handleBackspace(e);
      if (handled) {
        return;
      }

      // Call external handler first (for Enter, ArrowDown, etc.)
      // This allows parent to intercept Enter before we create a tag
      if (onInputKeyDown) {
        onInputKeyDown(e);
        // If the event was prevented by the parent, don't handle it here
        if (e.defaultPrevented) {
          return;
        }
      }

      // Handle Enter to create tag (only if not intercepted by parent)
      if (e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim()) {
          createTag(inputValue);
          setInputValue('');
          if (onInputChange) {
            onInputChange('');
          }
        }
        return;
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          'flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md',
          'bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
          'min-h-[42px] transition-all',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={handleContainerClick}
        {...props}
      >
        {/* Tags */}
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            label={tag.label}
            onRemove={() => removeTag(tag.id)}
            variant={tagVariant}
            size="md"
          />
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onInputFocus}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

export default TagInput;
