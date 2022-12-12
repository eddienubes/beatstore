import React from 'react';
import './error-indicator.scss';
import { Link } from 'react-router-dom';
import icon from './error.png';

function ErrorIndicator() {
  return (
    <div className="error__indicator-container">
      <div className="error__indicator__img-container">
        <img src={icon} alt="error" />
      </div>
      <div>Unfortunately, there is an error occurred, but we are already on the way to fix it.</div>
      {/* <div>If this message pops up very often, please, message me via <Link to="/contact">contact form</Link>.</div> */}
    </div>
  );
}

export default ErrorIndicator;
