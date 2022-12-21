import React from 'react';
import { Outlet } from 'react-router-dom';

import icstrat from '../../../assets/images/ic_strat.png';
import iccompetitionwhite from '../../../assets/images/ic_competition-white.png';
import icperf from '../../../assets/images/ic_perf.png';
import logo from '../../../assets/images/small-logo-white.png';
import icframe from '../../../assets/images/ic_auth-frame.png';

import './AuthLayout.scss';

const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-layout__cover">
      <div className="__container">
        <div className="auth-layout__cover__logo">
          <img src={logo} alt="cover" />
        </div>
        <div className="auth-layout__cover__center">
          <p className="auth-layout__cover__center__text">
            All-in-one solution to optimize your vendorsSelected&apos; revenue on delivery platforms
          </p>
          <div className="__img-frame">
            <img loading="lazy" src={icframe} alt="card" />
          </div>
          <div className="__block">
            <div className="auth-layout__cover__center-flex">
              <img loading="lazy" src={icstrat} alt="card" />
              <p className="center-flex__text">Set up a customized marketing strategy</p>
            </div>
            <div className="auth-layout__cover__center-flex">
              <img loading="lazy" src={icperf} alt="card" />
              <p className="center-flex__text">Gain valuable insights on your performance</p>
            </div>
            <div className="auth-layout__cover__center-flex">
              <img loading="lazy" src={iccompetitionwhite} alt="card" />
              <p className="center-flex__text">Stay on top of the competition</p>
            </div>
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
