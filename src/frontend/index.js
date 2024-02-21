import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//Entry point for webpack bundle which is loaded by the index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
