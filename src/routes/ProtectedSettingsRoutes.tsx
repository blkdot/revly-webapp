import Navbar from 'components/navbar/Navbar';
import { ContainerKit } from 'kits';
import { Outlet, useLocation } from 'react-router-dom';
import { settingsLink } from '../data/navbarData';

const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className='user-page'>
      <Navbar />
      <div>
        <div className='settings-header'>
          <ContainerKit>
            Settings - {settingsLink[0].subs.find((obj) => obj.path === location.pathname).title}
          </ContainerKit>
        </div>
        <ContainerKit>
          <Outlet />
        </ContainerKit>
      </div>
    </div>
  );
};

export default SettingsLayout;
