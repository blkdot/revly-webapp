import { usePlatform } from 'contexts';
import { logout } from 'firebase-config';
import { ButtonKit } from 'kits';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoutIcon } from 'assets/linkIcons/logout.svg';
import lines from '../../assets/images/lines.png';
import logo from '../../assets/images/logo.png';
import arrow from '../../assets/images/navbar-arrow.png';
import smallLogo from '../../assets/images/small-logo.png';
import { simpleLink } from '../../data/navbarData';
import Navlink from '../navlink/Navlink';
import './Navbar.scss';

const Navbar = () => {
  const [opened, setOpened] = useState(true);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      navigate('/');
      /* */
    }
  };

  const { userPlatformData } = usePlatform();

  const renderSimpleLink = (link) =>
    link.map((s) => (
      <Navlink
        className={!userPlatformData.onboarded && s.path !== '/dashboard' && 'navlink-disabled'}
        title={s.title}
        path={s.path}
        key={s.title}
      >
        {s.image}
      </Navlink>
    ));

  return (
    <div className={`navbar_wrapper ${opened && 'opened'}`}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`Navbar ${(opened || open) && 'opened'}`}
      >
        <ul>
          <li className={`Navbar_logo ${(opened || open) && 'opened'}`}>
            <img className='nav-logo' src={logo} alt='Revly' />
            <img className='nav-small-logo' src={smallLogo} alt='Revly' />
            <div
              role='presentation'
              tabIndex={-1}
              onClick={() => setOpened(!opened)}
              className={`nav-double-arrow ${opened && 'active'}`}
            >
              <img src={arrow} alt='Arrow' />
            </div>
          </li>
          {renderSimpleLink(simpleLink)}
        </ul>
        {/* <img className='nav-lines' src={lines} alt='Gradient lines' /> */}
        <span className='nav-line' />
        <ul className='Navbar-footer'>
          <li>
            <ButtonKit onClick={handleLogout} className='navbar-button-kit'>
              <LogoutIcon />
              <span>Log Out</span>
            </ButtonKit>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
