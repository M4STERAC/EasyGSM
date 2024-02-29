import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//Entry point for webpack bundle which is loaded by the index.html file
const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
