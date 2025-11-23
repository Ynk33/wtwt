import React from 'react';

const Loader = (): React.ReactNode => {
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loader;
