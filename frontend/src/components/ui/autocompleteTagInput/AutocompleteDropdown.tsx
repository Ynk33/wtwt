import React, { useRef } from 'react';

import useClickOutside from '@hooks/useClickOutside';
import { cn } from '@utils/cn';

export interface DropdownItem {
  key: string | number;
  label: string;
}

interface AutocompleteDropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  highlightedIndex: number;
  className?: string;
  maxHeight?: string;
  isOpen: boolean;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Dropdown component specifically designed for AutocompleteTagInput
 * Handles click outside logic and keyboard navigation highlighting
 */
const AutocompleteDropdown = ({
  items,
  onSelect,
  highlightedIndex,
  className,
  maxHeight = 'max-h-60',
  isOpen,
  onClose,
  inputRef,
}: AutocompleteDropdownProps): React.ReactNode => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useClickOutside(inputRef ? [dropdownRef, inputRef] : [dropdownRef], () => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto',
        maxHeight,
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.key}
          onClick={() => onSelect(item)}
          className={cn(
            'px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors',
            index === highlightedIndex && 'bg-blue-100'
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default AutocompleteDropdown;
