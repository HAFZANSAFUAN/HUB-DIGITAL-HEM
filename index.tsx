
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // Buang loading indicator asal setelah React bermula
  const initialLoading = document.getElementById('initial-loading');
  if (initialLoading) {
    initialLoading.style.display = 'none';
  }
}
