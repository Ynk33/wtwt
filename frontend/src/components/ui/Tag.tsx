import React from 'react';

import { cn } from '@utils/cn';

type TagVariant = 'default' | 'primary' | 'secondary' | 'danger';
type TagSize = 'sm' | 'md' | 'lg';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}

/**
 * Reusable Tag component with optional remove button
 */
const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (
    { label, onRemove, variant = 'default', size = 'md', className, ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center gap-1 rounded-md';

    const variants: Record<TagVariant, string> = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-200 text-gray-700',
      danger: 'bg-red-100 text-red-800',
    };

    const sizes: Record<TagSize, string> = {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span>{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="hover:opacity-70 focus:outline-none transition-opacity"
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = 'Tag';

export default Tag;
