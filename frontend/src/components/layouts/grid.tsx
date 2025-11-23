import React from 'react';

const Grid = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-8 w-full min-h-0 max-h-full overflow-y-auto">
      {children}
    </div>
  );
};

export default Grid;
