import React from 'react';

import Button from '@components/ui/Button';

const RateMeWatchedButton = ({
  onClick,
}: {
  onClick: () => void;
}): React.ReactNode => {
  return (
    <Button variant="primary" onClick={onClick}>
      I've watched this movie
    </Button>
  );
};

export default RateMeWatchedButton;
