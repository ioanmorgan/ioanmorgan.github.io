import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const personalStatements = [
  "Guiding teams to deliver,\nwithout the drama.",
  "Calm leadership.\nReliable engineering.",
  "From code to culture, \nbuilding what lasts.",
  "Turning complexity\ninto calm.",
  "Building systems,\nSupporting people.",
  "Engineering clarity,\nleadership that lasts.",
  "From ideas to impact\nsmoothly.",
  "Calm hands,\nconfident delivery.",
  "Crafting code,\nshaping culture.",
  "From sparks to scale,\nwithout the stress!"
];

const PersonalStatement = ({ isDarkMode }) => {
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentStatement = personalStatements[currentStatementIndex];
    let charIndex = 0;
    
    // Start typing effect
    setIsTyping(true);
    setDisplayedText('');
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentStatement.length) {
        setDisplayedText(currentStatement.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 80); // Slower typing speed

    return () => clearInterval(typeInterval);
  }, [currentStatementIndex]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-advance to next statement
  useEffect(() => {
    const advanceInterval = setInterval(() => {
      setCurrentStatementIndex((prevIndex) => 
        (prevIndex + 1) % personalStatements.length
      );
    }, 6000); // Slower statement replacement - 6 seconds

    return () => clearInterval(advanceInterval);
  }, []);

  return (
    <div className="personal-statement">
      <img 
        src="/profile-picture.jpg" 
        alt="Ioan Morgan" 
        className="profile-picture"
      />
      <h1 className="name-heading">Ioan Morgan</h1>
      <h2 className="subheading typewriter">
        {displayedText.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < displayedText.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
        <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>_</span>
      </h2>
      <a
        href="https://www.linkedin.com/in/ioanamorgan/"
        target="_blank"
        rel="noopener noreferrer"
        className="linkedin-button"
      >
        <FontAwesomeIcon icon={faLinkedin} />
        Connect on LinkedIn
      </a>
    </div>
  );
}

export default PersonalStatement;