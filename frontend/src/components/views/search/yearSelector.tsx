import React from 'react';

import { useSearchStore } from '@/stores/SearchStore';
import RangeSelector from '@components/ui/RangeSelector';

const YearSelector = (): React.ReactNode => {
  const { years, setYears } = useSearchStore();
  const maxYear = new Date().getFullYear();

  return (
    <RangeSelector
      min={1900}
      max={maxYear}
      step={1}
      label="Year"
      value={years}
      onChange={setYears}
    />
  );
};

export default YearSelector;
