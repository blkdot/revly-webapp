import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUserAuth } from 'contexts';
import { usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import {
  AccordionDetailsKit,
  AccordionKit,
  AccordionSummaryKit,
  ButtonKit,
  TypographyKit,
} from 'kits';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoutIcon from '../../assets/images/ic_logout.png';
import lines from '../../assets/images/lines.png';
import logo from '../../assets/images/logo.png';
import arrow from '../../assets/images/navbar-arrow.png';
import smallLogo from '../../assets/images/small-logo.png';
import { accordionLink, settingsLink, simpleLink } from '../../data/navbarData';
import { vendorsAtom } from '../../store/vendorsAtom';
import Navlink from '../navlink/Navlink';
import './Navbar.scss';

const Navbar = () => {
  const [opened, setOpened] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (e) {
      navigate('/');
      /* */
    }
  };
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { userPlatformData } = usePlatform();

  const renderAccordionLinkSub = (s) => (
    <Navlink title={s.title} path={s.path} key={s.title}>
      {s.src ? <img className='nav-icon' src={s.src} alt={s.title} /> : ''}
    </Navlink>
  );

  const renderSimpleLink = (link) =>
    link.map((s) => (
      <Navlink
        className={
          !userPlatformData.onboarded && s.path !== '/dashboardOnboard' ? 'navlink-disabled' : ''
        }
        title={s.title}
        path={s.path}
        key={s.title}
      >
        <img className='nav-icon' src={s.src} alt={s.title} />
      </Navlink>
    ));

  const renderAccordionLink = () =>
    accordionLink.map((a) => (
      <AccordionKit
        expanded={
          !!((expanded === (a.id as any) && opened) || (expanded === (a.id as any) && open))
        }
        onChange={handleChange(a.id)}
        className={`navbar-accordion ${!userPlatformData.onboarded ? 'disabled' : ''}`}
        key={a.id}
        disabled={!userPlatformData.onboarded}
      >
        <ButtonKit
          className={`navbar-button-kit ${
            a.subs.some((sub) => sub.path === pathname) ? 'active' : ''
          }`}
        >
          <AccordionSummaryKit
            className='accordion-sum'
            expandIcon={opened || open ? <ExpandMoreIcon /> : ''}
          >
            <TypographyKit
              sx={{
                display: 'flex',
                alignItems: 'center',
                gridGap: '16px',
                fontSize: '14px',
              }}
            >
              <img className='nav-icon' src={a.src} alt={a.title} />
              <span>{a.title}</span>
            </TypographyKit>
          </AccordionSummaryKit>
        </ButtonKit>
        <AccordionDetailsKit className='navbar-accordion-details'>
          {a.subs.map(renderAccordionLinkSub)}
        </AccordionDetailsKit>
      </AccordionKit>
    ));

  const renderSettingsAccordionLink = () =>
    settingsLink.map((a) => (
      <AccordionKit
        expanded={
          !!((expanded === (a.id as any) && opened) || (expanded === (a.id as any) && open))
        }
        onChange={handleChange(a.id)}
        className={`navbar-accordion ${!userPlatformData.onboarded ? 'disabled' : ''}`}
        key={a.id}
        disabled={!userPlatformData.onboarded}
      >
        <ButtonKit
          className={`navbar-button-kit ${
            a.subs.some((sub) => sub.path === pathname) ? 'active' : ''
          }`}
        >
          <AccordionSummaryKit
            className='accordion-sum'
            expandIcon={opened || open ? <ExpandMoreIcon /> : ''}
          >
            <TypographyKit
              sx={{
                display: 'flex',
                alignItems: 'center',
                gridGap: '16px',
                fontSize: '14px',
              }}
            >
              <img className='nav-icon' src={a.src} alt={a.title} />
              <span>{a.title}</span>
            </TypographyKit>
          </AccordionSummaryKit>
        </ButtonKit>
        <AccordionDetailsKit className='navbar-accordion-details'>
          {a.subs.map(renderAccordionLinkSub)}
        </AccordionDetailsKit>
      </AccordionKit>
    ));

  return (
    <div className={`navbar_wrapper ${opened ? 'opened' : ''}`}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`Navbar ${opened || open ? 'opened' : ''}`}
      >
        <ul>
          <li className={`Navbar_logo ${opened || open ? 'opened' : ''}`}>
            <img className='nav-logo' src={logo} alt='Revly' />
            <img className='nav-small-logo' src={smallLogo} alt='Revly' />
            <div
              role='presentation'
              tabIndex={-1}
              onClick={() => setOpened(!opened)}
              className={`nav-double-arrow ${opened ? 'active' : ''}`}
            >
              <img src={arrow} alt='Arrow' />
            </div>
          </li>
          {renderSimpleLink(simpleLink)}
          {renderAccordionLink()}
        </ul>
        <img className='nav-lines' src={lines} alt='Gradient lines' />
        <ul className='Navbar-footer'>
          {renderSettingsAccordionLink()}
          <li>
            <ButtonKit onClick={handleLogout} className='navbar-button-kit'>
              <img className='nav-icon' src={logoutIcon} alt='Logout' />
              <span>Log Out</span>
            </ButtonKit>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
