import React from 'react';

const Error = ({ error }: { error: string }): React.ReactNode => {
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default Error;
