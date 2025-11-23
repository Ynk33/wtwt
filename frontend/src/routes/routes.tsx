import { Navigate, Route, Routes } from 'react-router-dom';

import Discover from '@components/views/discover';
import Search from '@components/views/search';

const AppRoutes = (): React.ReactNode => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
