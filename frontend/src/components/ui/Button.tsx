import React from 'react';

import { cn } from '@utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

/**
 * Reusable Button component with Tailwind CSS
 * Example of component composition with class variants
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-blue-500 border border-blue-700 text-white hover:bg-blue-600 focus:ring-blue-500',
      secondary:
        'bg-gray-200 border border-gray-400 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      tertiary:
        'bg-white/30 backdrop-blur-sm border border-gray-300 text-gray-800 hover:bg-white/70 hover:backdrop-blur-sm focus:ring-gray-400',
      danger:
        'bg-red-500 border border-red-700 text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
