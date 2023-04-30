import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer } from '@fortawesome/fontawesome-free-solid';

const PseronalStatement = () => {
  return (
    <div className="personal-statement pannel">
      <h2>Hello! I'm Ioan,</h2>
      <p>
        A Product-focused Head of Engineering with a passion for process evolution and team empowerment.  
        I specialise in startups & growth stage companies.
      </p>
      <p>
        Let's connect to discuss how I can help you!
        <a
          href="https://www.linkedin.com/in/ioanamorgan/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "1rem", color: "#fff" }}
        >
          <FontAwesomeIcon icon="fa-brands fa-linkedin" />
        </a>
      </p>
      
    <div className="conways-hint personal-statement pannel">
      Feel free to add to the <a href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life">Game of Life</a> by clicking the background &nbsp;
      <FontAwesomeIcon icon={ faMousePointer } beat />
    </div>
      
    </div>
  );
}

export default PseronalStatement;