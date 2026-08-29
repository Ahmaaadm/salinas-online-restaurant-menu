import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* Hash routing keeps the app a single static bundle — no router dependency,
   and #/admin still works on any host without rewrite rules. */
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  if (hash.startsWith('#/admin')) {
    return <Suspense fallback={null}><AdminApp /></Suspense>;
  }
  return <App />;
}

createRoot(document.getElementById('root')).render(<Root />);
