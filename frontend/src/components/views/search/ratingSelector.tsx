import React from 'react';
import { useSearchStore } from '@stores/SearchStore';

import RangeSelector from '@components/ui/RangeSelector';

const RatingSelector = (): React.ReactNode => {
  const { ratings, setRatings } = useSearchStore();
  return (
    <RangeSelector
      min={0}
      max={10}
      step={0.1}
      label="Rating"
      value={ratings}
      onChange={setRatings}
    />
  );
};

export default RatingSelector;
