import React from 'react';

import './auth-container.scss';
import { Route } from 'react-router-dom';
import LoginPage from '../../pages/auth-pages/login-page';
import RegisterPage from '../../pages/auth-pages/register-page';
import Footer from '../../components/footer';

function AuthContainer() {
  return (
    <div className="auth__page">
      <Route exact path="/auth/login" component={LoginPage} />
      <Route exact path="/auth/register" component={RegisterPage} />
    </div>
  );
}

export default AuthContainer;
