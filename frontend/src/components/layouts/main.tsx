import React from 'react';

const Main = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <div className="flex flex-col w-screen h-screen">{children}</div>;
};

export default Main;
