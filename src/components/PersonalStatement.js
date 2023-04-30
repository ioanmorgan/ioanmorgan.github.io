import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      
    </div>
  );
}

export default PseronalStatement;