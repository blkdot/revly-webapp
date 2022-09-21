import React from 'react';
import { Outlet } from 'react-router-dom';

import cardImage from '../../../assets/images/illustration_register.svg';

import './AuthLayout.scss';

const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-layout__cover">
      <div className="auth-layout__cover__logo">
        <img src="/images/cover.png" alt="cover" width="180" height="70" />
      </div>
      <div className="auth-layout__cover__center">
        <div>
          <p className="auth-layout__cover__center__text">
            All in one software to optimize your revenue on online channels
          </p>
          <div className="auth-layout__cover__center-flex">
            <img src={cardImage} alt="card" />
            <p className="center-flex__text">Set up a customized marketing strategy</p>
          </div>
          <div className="auth-layout__cover__center-flex">
            <img src={cardImage} alt="card" />
            <p className="center-flex__text">Gain valuable insights on your performance</p>
          </div>
          <div className="auth-layout__cover__center-flex">
            <img src={cardImage} alt="card" />
            <p className="center-flex__text">Stay on top of the competition</p>
          </div>
        </div>
      </div>
    </div>
    <div className="auth-layout__form-block">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
