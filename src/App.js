import React, { useState, useEffect } from 'react';
import './App.css';
import AnimatedBackground from "./components/AnimatedBackground";
import PersonalStatement from "./components/PersonalStatement";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference, default to dark
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // Update document class for CSS variables
    document.documentElement.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      <PersonalStatement isDarkMode={isDarkMode} />
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default App;
