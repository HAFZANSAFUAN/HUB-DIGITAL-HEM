
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Isytihar process.env untuk TypeScript build
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string;
  };
};

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Sembunyikan loading indicator selepas React sedia
    const loader = document.getElementById('initial-loading');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
      }, 500);
    }
  }
};

// Pastikan DOM sedia sebelum run
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
