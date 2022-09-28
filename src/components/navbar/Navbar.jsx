// TODO: fix all linter problem
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './Navbar.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';
import smallLogo from '../../assets/images/small-logo.png';
import AccordionSummaryKit from '../../kits/accordionSummary/AccordionSummaryKit';
import AccordionKit from '../../kits/accordion/AccordionKit';
import AccordionDetailsKit from '../../kits/accordionDetails/AccordionDetails';
import TypographyKit from '../../kits/typography/TypographyKit';
import ButtonKit from '../../kits/button/ButtonKit';
import arrow from '../../assets/images/navbar-arrow.png';
import dashboardIcon from '../../assets/images/ic_dashboard.png';
import planningIcon from '../../assets/images/ic_planning.png';
import marketingIcon from '../../assets/images/ic_marketing.png';
import offerIcon from '../../assets/images/ic_offers.png';
import adsIcon from '../../assets/images/ic_ads.png';
import competitionIcon from '../../assets/images/ic_competiton.png';
import logoutIcon from '../../assets/images/ic_logout.png';
import settingsIcon from '../../assets/images/ic_settings.png';
import lines from '../../assets/images/lines.png';
import alertsIcon from '../../assets/images/ic_alerts.png';
import rankingIcon from '../../assets/images/ic_ranking.png';

const Link = ({ path, title, children }) => (
  <NavLink to={path}>
    <ButtonKit className="navbar-button-kit">
      {children}
      <span>{title}</span>
    </ButtonKit>
  </NavLink>
);

const Navbar = () => {
  const [opened, setOpened] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      console.log(`${user.email} is logged out`);
    } catch (e) {
      console.error(e.message);
    }
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={`navbar_wrapper ${opened ? 'opened' : ' '}`}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`Navbar ${opened || open ? 'opened' : ''}`}>
        <ul>
          <li className={`Navbar_logo ${opened || open ? 'opened' : ''}`}>
            <img className="nav-logo" src={logo} alt="Revly" />
            <img className="nav-small-logo" src={smallLogo} alt="Revly" />
            <div
              role="presentation"
              tabIndex={-1}
              onClick={() => setOpened(!opened)}
              className={`nav-double-arrow ${opened ? 'active' : ''}`}>
              <img src={arrow} alt="Arrow" />
            </div>
          </li>
          <Link title="Dashboard" path="/dashboard">
            <img className="nav-icon" src={dashboardIcon} alt="Dashboard" />
          </Link>
          <Link title="Planning" path="/planning">
            <img className="nav-icon" src={planningIcon} alt="Planning" />
          </Link>
          <AccordionKit
            expanded={!!((expanded === 'panel1' && opened) || (expanded === 'panel1' && open))}
            onChange={handleChange('panel1')}
            className="navbar-accordion">
            <ButtonKit
              className={`navbar-button-kit ${
                pathname === '/marketing/offer' || pathname === '/marketing/ads' ? 'active' : ''
              }`}>
              <AccordionSummaryKit
                className="accordion-sum"
                expandIcon={opened || open ? <ExpandMoreIcon /> : ''}>
                <TypographyKit
                  sx={{ display: 'flex', alignItems: 'center', gridGap: '16px', fontSize: '14px' }}>
                  <img className="nav-icon" src={marketingIcon} alt="Marketing" />
                  <span>Marketing</span>
                </TypographyKit>
              </AccordionSummaryKit>
            </ButtonKit>
            <AccordionDetailsKit className="navbar-accordion-details">
              <Link title="Offer" path="/marketing/offer">
                <img className="nav-icon" src={offerIcon} alt="Offer" />
              </Link>
              <Link title="Advertisments" path="/marketing/ads">
                <img className="nav-icon" src={adsIcon} alt="Advertisments" />
              </Link>
            </AccordionDetailsKit>
          </AccordionKit>
          <AccordionKit
            expanded={!!((expanded === 'panel2' && opened) || (expanded === 'panel2' && open))}
            onChange={handleChange('panel2')}
            className="navbar-accordion">
            <ButtonKit
              className={`navbar-button-kit ${
                pathname === '/competition/ranking' || pathname === '/competition/alerts'
                  ? 'active'
                  : ''
              }`}>
              <AccordionSummaryKit
                className="accordion-sum"
                expandIcon={opened || open ? <ExpandMoreIcon /> : ''}>
                <TypographyKit
                  sx={{ display: 'flex', alignItems: 'center', gridGap: '16px', fontSize: '14px' }}>
                  <img className="nav-icon" src={competitionIcon} alt="Competition" />
                  <span>Competition</span>
                </TypographyKit>
              </AccordionSummaryKit>
            </ButtonKit>
            <AccordionDetailsKit className="navbar-accordion-details">
              <Link title="Ranking" path="/competition/ranking">
                <img className="nav-icon" src={rankingIcon} alt="Ranking" />
              </Link>
              <Link title="Alerts" path="/competition/alerts">
                <img className="nav-icon" src={alertsIcon} alt="Alerts" />
              </Link>
            </AccordionDetailsKit>
          </AccordionKit>
        </ul>
        <img className="nav-lines" src={lines} alt="Gradient lines" />
        <ul className="Navbar-footer">
          <Link title="Settings" path="/settings">
            <img className="nav-icon" src={settingsIcon} alt="Settings" />
          </Link>
          <li onClick={handleLogout}>
            <ButtonKit className="navbar-button-kit">
              <img className="nav-icon" src={logoutIcon} alt="Logout" />
              <span>Log Out</span>
            </ButtonKit>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
