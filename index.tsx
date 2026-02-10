
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Pengisytiharan global untuk Window supaya TypeScript tidak ralat semasa akses window.process
declare global {
  interface Window {
    process: any;
  }
}

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    const loader = document.getElementById('initial-loading');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
      }, 500);
    }
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
