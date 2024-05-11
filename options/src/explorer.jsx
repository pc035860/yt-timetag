import React from 'react';
import ReactDOM from 'react-dom/client';
import Inner from './ExplorerApp';
import './explorer.css';

import './i18next';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Inner />
  </React.StrictMode>
);
