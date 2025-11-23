import React from 'react';

import type { IMovie } from '@types';
import MoviePoster from '@components/commons/moviePoster';
import Modal from '@components/layouts/modal';
import TwoColumns from '@components/layouts/two-columns';
import MovieDetails from '@components/views/movieDetails/movieDetails';

const MovieModal = ({
  movie,
  isOpen,
  onClose,
}: {
  movie: IMovie;
  isOpen: boolean;
  onClose: () => void;
}): React.ReactNode => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TwoColumns
        left={<MoviePoster movie={movie} />}
        leftRatio={1}
        right={<MovieDetails movie={movie} />}
        rightRatio={2}
      />
    </Modal>
  );
};

export default MovieModal;
