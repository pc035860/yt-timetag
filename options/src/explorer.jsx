import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ExplorerApp';
import './explorer.css';

import './i18next';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
