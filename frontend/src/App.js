import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import License from './License'; // Import your License component
// import './App.css'; // Temporarily commented out for troubleshooting CSS issues
import logo from './logo.svg'; // Your existing logo import

// A simple Home component for the root path (/)
// You can replace this with your actual homepage component later
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to InternalAI!</h1>
        <p>This is your homepage.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* The License button */}
        <Link to="/license">
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition mt-4">
            License
          </button>
        </Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for your Home page (root path) */}
        <Route path="/" element={<Home />} />

        {/* Route for your License page */}
        <Route path="/license" element={<License />} />
      </Routes>
    </Router>
  );
}

export default App;