import React from 'react';

import MenuItem from '@components/ui/MenuItem';

const Header = (): React.ReactNode => {
  return (
    <div className="flex flex-row items-center gap-16 px-16 w-full h-16 bg-gray-200 shrink-0">
      <MenuItem to="/discover">Discover</MenuItem>
      <MenuItem to="/search">Search</MenuItem>
      <MenuItem to="/watchlist">My watch list</MenuItem>
      <MenuItem to="/watched">Already watched</MenuItem>
    </div>
  );
};

export default Header;
