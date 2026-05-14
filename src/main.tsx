import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { queryClient } from './lib/queryClient';
import { router } from './routes/AppRoutes';

if (typeof window !== 'undefined') {
  try {
    const persisted = window.localStorage.getItem('whazzonline-theme');
    if (persisted) {
      const parsed = JSON.parse(persisted) as { state?: { theme?: 'light' | 'dark' } };
      if (parsed.state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  } catch {
    // Ignore malformed persisted theme payloads.
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
