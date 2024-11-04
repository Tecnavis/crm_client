import React from 'react';
import './error.css';
import ralph from '../Images/404.png';

const ErrorPage = () => {
   
  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-code">
        <h1>4<span className="character-face" style={{ backgroundImage: `url(${ralph})` }}></span>4</h1>
        </div>
        <p className="error-message">You didn’t break the internet, but we can’t find what you are looking for.</p>
        
      </div>
    </div>
  );
};

export default ErrorPage;
