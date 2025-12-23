import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Root element को ढूँढना
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// React Root बनाना और App को रेंडर करना
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);