import Navbar from 'components/navbar/Navbar';
import { useUserAuth } from 'contexts';
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import { useDate } from 'hooks';
import { ContainerKit, SpinnerKit } from 'kits';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { settingsLink } from '../data/navbarData';

const ProtectedSettingsRoutes = () => {
  const { user } = useUserAuth();
  const { setDate } = useDate();
  const defaultDate = {
    beforePeriod: {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: new Date(),
    },
    afterPeriod: {
      startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    },
    titleDate: 'current week',
    titleafterPeriod: 'last week',
    typeDate: 'week',
  };
  const location = useLocation();
  const clear = () => {
    localStorage.setItem('date', JSON.stringify(defaultDate));
    setDate(defaultDate);
  };
  const checkLeaveTime = () => {
    const leaveTime = JSON.parse(localStorage.getItem('leaveTime'));
    if (new Date(leaveTime).toLocaleDateString() < new Date().toLocaleDateString()) {
      clear();
    } else if (new Date(leaveTime).getHours() <= new Date().getHours() - 3) {
      clear();
    }
  };
  useEffect(() => {
    window.onload = checkLeaveTime;
    window.onbeforeunload = (e) => {
      localStorage.setItem('leaveTime', JSON.stringify(new Date()));
      e.target.hidden = true;
      return '';
    };
  }, []);

  if (typeof user === 'boolean' && user) {
    return (
      <div style={{ marginTop: '20rem', marginLeft: '45%' }}>
        <SpinnerKit />
      </div>
    );
  }

  const renderLayout = () => (
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

  return user ? renderLayout() : <Navigate to='/' />;
};

export default ProtectedSettingsRoutes;