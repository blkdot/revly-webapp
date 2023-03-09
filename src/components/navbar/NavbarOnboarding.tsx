import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';

import './Navbar.scss';

import Navlink from 'components/navlink/Navlink';
import { ButtonKit } from 'kits';

import { logout } from 'firebase-config';
import lines from '../../assets/images/lines.png';
import logo from '../../assets/images/logo.png';
import smallLogo from '../../assets/images/small-logo.png';

import { vendorsAtom } from '../../store/vendorsAtom';

const FlagIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M4 21V5'
      stroke='#906BFF'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M20 15.6867C14.1818 20.2361 9.81818 11.1373 4 15.6867V4.31329C9.81818 -0.236079 14.1818 8.86266 20 4.31329V15.6867Z'
      stroke='#906BFF'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const HelpIcon = () => (
  <svg width='18' height='26' viewBox='0 0 18 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M8.28866 0.838895C3.56113 1.13302 1.09072 3.81021 0.875 8.65149H5.64397C5.70369 6.97449 6.63969 5.7208 8.3825 5.53596C10.0932 5.35436 11.7162 5.76183 12.2078 6.93142C12.7387 8.19486 11.5468 9.66305 10.9801 10.2793C9.93113 11.4221 8.22731 12.2557 7.34413 13.4887C6.47841 14.6969 6.32444 16.2865 6.25781 18.2321H10.4609C10.5198 16.9881 10.6027 15.7966 11.1686 15.0235C12.0891 13.7674 13.4639 13.1787 14.616 12.1867C15.7165 11.2385 16.8743 10.0957 17.071 8.32689C17.6613 3.03305 13.34 0.523645 8.28866 0.838895Z'
      fill='#1890FF'
    />
    <path
      d='M8.39581 25.1875C9.86137 25.1875 11.0494 24.0174 11.0494 22.5741C11.0494 21.1308 9.86137 19.9607 8.39581 19.9607C6.93026 19.9607 5.74219 21.1308 5.74219 22.5741C5.74219 24.0174 6.93026 25.1875 8.39581 25.1875Z'
      fill='#1890FF'
    />
  </svg>
);

const LogoutIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12 15L15 12M15 12L12 9M15 12L4 12'
      stroke='#B72136'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M4 7V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V17'
      stroke='#B72136'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const simpleLink = [
  { title: 'Flag', path: '/#', src: FlagIcon },
  { title: 'Help', path: '/#', src: HelpIcon },
];

const NavbarOnboarding = () => {
  const navigate = useNavigate();

  const [, setVendors] = useAtom(vendorsAtom);

  const handleLogout = async () => {
    setVendors({
      vendorsSelected: [],
      vendorsObj: {},
      vendorsArr: [],
      display: {},
      chainObj: {},
      chainData: [],
    });
    try {
      await logout();
      navigate('/');
    } catch (e) {
      /* */
    }
  };

  const renderSimpleLink = () =>
    simpleLink.map((s) => (
      <Navlink
        title={s.title}
        path={s.path}
        key={s.title}
        style={{
          padding: '12px',
          borderRadius: '50%',
          backgroundColor: '#906BFF14',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '48px',
          height: '48px',
        }}
      >
        {s.src()}
      </Navlink>
    ));

  return (
    <div className='navbar_wrapper' style={{ zIndex: '1302' }}>
      <div className='Navbar'>
        <ul>
          <li className='Navbar_logo'>
            <img className='nav-logo' src={logo} alt='Revly' />
            <img className='nav-small-logo' src={smallLogo} alt='Revly' />
          </li>
          {renderSimpleLink()}
        </ul>
        <img className='nav-lines' src={lines} alt='Gradient lines' />
        <ul className='Navbar-footer'>
          <li>
            <ButtonKit
              onClick={handleLogout}
              className='navbar-button-kit'
              style={{
                padding: '12px',
                borderRadius: '50%',
                backgroundColor: '#FF484214',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '48px',
                height: '48px',
              }}
            >
              <LogoutIcon />
            </ButtonKit>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarOnboarding;
