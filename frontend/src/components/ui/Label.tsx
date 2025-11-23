import React from 'react';

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <label className="text-sm font-medium text-gray-700">{children}</label>
  );
};

export default Label;
