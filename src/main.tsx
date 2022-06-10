import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from 'routes';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'components';

import './style/global.scss';
import './style/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
);
