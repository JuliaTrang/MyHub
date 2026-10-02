import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Basic global reset
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f6fa;
    color: #333;
  }
  a {
    color: #3498db;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
