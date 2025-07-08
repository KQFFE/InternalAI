import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you were using an older version of React (e.g., React 17) and
// it was previously working, your index.js might have looked like this:
// import ReactDOM from 'react-dom';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

reportWebVitals();