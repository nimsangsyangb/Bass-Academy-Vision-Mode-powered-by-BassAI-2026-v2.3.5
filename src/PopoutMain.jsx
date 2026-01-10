/**
 * Popout Main Entry - Bass Trainer
 * Entry point for the pop-out trainer window
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PopoutApp from './PopoutApp.jsx';

createRoot(document.getElementById('popout-root')).render(
  <StrictMode>
    <PopoutApp />
  </StrictMode>,
);
