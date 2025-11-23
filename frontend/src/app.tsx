import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/app.css';

import Main from '@components/layouts/main.tsx';
import Header from '@components/views/header';
import AppRoutes from '@routes/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Main>
        <Header />
        <AppRoutes />
      </Main>
    </BrowserRouter>
  </StrictMode>
);
