import React from 'react';

import { cn } from '@utils/cn';

type HighlightVariant = 'info' | 'warning' | 'error';

interface HighlightProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: HighlightVariant;
}

const Highlight = ({
  variant = 'info',
  className,
  children,
  ...props
}: HighlightProps): React.ReactNode => {
  const baseStyles = 'rounded-md p-4';

  const variants: Record<HighlightVariant, string> = {
    info: 'bg-blue-100 text-teal-900',
    warning: 'bg-yellow-200 text-white',
    error: 'bg-red-200 text-white',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

Highlight.displayName = 'Highlight';

export default Highlight;
