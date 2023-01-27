import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Navbar.scss';

import { useUserAuth } from '../../contexts/AuthContext';
import AccordionKit from '../../kits/accordion/AccordionKit';
import AccordionDetailsKit from '../../kits/accordionDetails/AccordionDetails';
import AccordionSummaryKit from '../../kits/accordionSummary/AccordionSummaryKit';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import Navlink from '../navlink/Navlink';

import logoutIcon from '../../assets/images/ic_logout.png';
import settingsIcon from '../../assets/images/ic_settings.png';
import lines from '../../assets/images/lines.png';
import logo from '../../assets/images/logo.png';
import arrow from '../../assets/images/navbar-arrow.png';
import smallLogo from '../../assets/images/small-logo.png';

import { accordionLink, simpleLink } from '../../data/navbarData';
import { vendorsAtom } from '../../store/vendorsAtom';

const Navbar = () => {
  const [opened, setOpened] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<any>(false);

  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [, setVendors] = useAtom(vendorsAtom);

  const handleLogout = async () => {
    setVendors({
      vendorsSelected: [],
      vendorsObj: {},
      vendorsArr: [],
      display: {},
      chainObj: {},
    });
    try {
      await logOut();
      navigate('/');
    } catch (e) {
      /* */
    }
  };
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderSimpleLink = () =>
    simpleLink.map((s) => (
      <Navlink title={s.title} path={s.path} key={s.title}>
        <img className='nav-icon' src={s.src} alt={s.title} />
      </Navlink>
    ));

  const renderAccordionLink = () =>
    accordionLink.map((a) => (
      <AccordionKit
        expanded={!!((expanded === a.id && opened) || (expanded === a.id && open))}
        onChange={handleChange(a.id)}
        className='navbar-accordion'
        key={a.id}
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

  const renderAccordionLinkSub = (s) => (
    <Navlink title={s.title} path={s.path} key={s.title}>
      <img className='nav-icon' src={s.src} alt={s.title} />
    </Navlink>
  );

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
          {renderSimpleLink()}
          {renderAccordionLink()}
        </ul>
        <img className='nav-lines' src={lines} alt='Gradient lines' />
        <ul className='Navbar-footer'>
          <Navlink title='Settings' path='/settings'>
            <img className='nav-icon' src={settingsIcon} alt='Settings' />
          </Navlink>
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
