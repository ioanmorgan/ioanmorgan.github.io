import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const personalStatements = [
  "Guiding teams to deliver,\nwithout the drama.",
  "Calm leadership.\nReliable engineering.",
  "From code to culture, \nbuilding what lasts.",
  "Turning complexity\ninto calm.",
  "Building systems,\nsupporting people.",
  "Engineering clarity,\nleadership that lasts.",
  "From ideas to impact\nsmoothly.",
  "Calm hands,\nconfident delivery.",
  "Crafting code,\nshaping culture.",
  "From sparks to scale,\nwithout the stress!"
];

const workSections = [
  {
    title: "Growth companies",
    description: "Bringing calm, steady leadership to scaling teams.",
    icon: "📈"
  },
  {
    title: "Startups", 
    description: "Building early prototypes and guiding engineering from day one.",
    icon: "🚀"
  },
  {
    title: "Entrepreneurs & adventurers",
    description: "Turning ideas into working software, fast and reliable.",
    icon: "💡"
  }
];

const PersonalStatement = () => {
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const currentStatement = personalStatements[currentStatementIndex];
    let charIndex = 0;
    
    // Start typing effect
    setDisplayedText('');
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentStatement.length) {
        setDisplayedText(currentStatement.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
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
      
      <button 
        className="expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Hide who I work with" : "Show who I work with"}
      >
        <span>Who I Work With</span>
        <FontAwesomeIcon 
          icon={isExpanded ? faChevronUp : faChevronDown} 
          className="expand-icon"
        />
      </button>

      <div className={`who-i-work-with ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="work-list-compact">
          {workSections.map((section, index) => (
            <div key={index} className="work-item-compact">
              <span className="work-icon-small">{section.icon}</span>
              <span className="work-text-compact">
                <strong>{section.title}</strong> — {section.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-buttons">
        <a
          href="https://www.linkedin.com/in/ioanamorgan/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-button linkedin"
        >
          <FontAwesomeIcon icon={faLinkedin} />
          LinkedIn
        </a>
        <a
          href="mailto:me@ioanmorgan.com"
          className="contact-button email"
        >
          📧 Email
        </a>
      </div>
    </div>
  );
};

export default PersonalStatement;
