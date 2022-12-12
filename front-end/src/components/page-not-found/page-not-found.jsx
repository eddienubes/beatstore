import React from 'react';
import './page-not-found.scss';
import { Link } from 'react-router-dom';
import icon from './attention.png';
import Footer from '../footer';

function PageNotFound() {
  return (
    <div className="page-not-found__container">
      <div className="page-not-found__img-container">
        <img src={icon} alt="attention" />
      </div>
      <div>Page you are looking for hasn't been found!</div>
      <div>
        Try going back to
        <Link to="/">home page</Link>.
      </div>
    </div>
  );
}

export default PageNotFound;
