import React from 'react';

const MovieDetailEntry = ({
  title,
  value,
}: {
  title: string;
  value: string;
}): React.ReactNode => {
  return (
    <div>
      <h4 className="italic">{title}</h4>
      <p className="text-lg">{value}</p>
    </div>
  );
};

export default MovieDetailEntry;
