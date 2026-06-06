import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// StrictMode removed - it causes useEffects to run twice in development,
// which doubles Firestore reads. Remove StrictMode for production.
createRoot(document.getElementById('root')!).render(
  <App />
);
