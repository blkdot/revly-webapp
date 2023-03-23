import { usePlatform } from 'contexts';
import { logout } from 'firebase-config';
import { ButtonKit } from 'kits';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoutIcon } from 'assets/linkIcons/logout.svg';
import smallLogo from '../../assets/images/small-logo.png';
import { simpleLink } from '../../data/navbarData';
import Navlink from '../navlink/Navlink';
import './Navbar.scss';

const Navbar = () => {
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
    <div className='navbar_wrapper'>
      <div
        className='Navbar'
      >
        <ul>
          <Link to='/dashboard' className='Navbar_logo'>
            <img className='nav-small-logo' src={smallLogo} alt='Revly' />
          </Link>
          {renderSimpleLink(simpleLink)}
        </ul>
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
