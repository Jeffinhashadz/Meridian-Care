import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { logger } from './utils/logger';

const rootEl = document.getElementById('root');
if (!rootEl) {
  logger.error('Root element #root missing from index.html');
  throw new Error('Root element not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

logger.info('React root mounted');
