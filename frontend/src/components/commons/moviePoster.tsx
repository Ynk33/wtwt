import type { IMovie } from '@types';

const MoviePoster = ({ movie }: { movie: IMovie }) => {
  return (
    <div className="w-full h-full aspect-2/3 overflow-hidden">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MoviePoster;
