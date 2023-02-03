import { useUserAuth } from 'contexts';
import { SpinnerKit } from 'kits';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { usePlatform } from '../hooks/usePlatform';
// import config from '../setup/config';

const ProtectedOnboardRoutes = () => {
  const [allowed, setAllowed] = useState<any>(false);
  const [preAllowed, setPreAllowed] = useState(false);
  const { user } = useUserAuth();
  const { settingsLogin, settingsOnboarded } = useApi();
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  // const { timeRefreshToken } = config;
  // const location = useLocation();
  const navigate = useNavigate();

  const getPlatformData = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const res = await settingsOnboarded({
        master_email: user.email,
        access_token: user.accessToken,
      });

      if (res instanceof Error || !res.onboarded || !res.platforms) throw new Error('');

      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...res.platforms },
      });

      setPreAllowed(true);
    } catch (error) {
      setAllowed(error);
    }
  };

  useEffect(() => {
    getPlatformData();
  }, []);

  // useEffect(() => {
  //   if (!userPlatformData.onboarded) {
  //     reccurentLogin();
  //   }

  //   setAllowed(true);
  // }, [location]);

  // const reccurentLogin = async () => {
  //   const res = await settingsLogin({
  //     master_email: user.email,
  //     access_token: user.accessToken,
  //   });

  //   if (res instanceof Error || !res.onboarded) {
  //     cleanPlatformData();
  //     setAllowed(new Error(''));
  //     return;
  //   }

  //   setUserPlatformData({
  //     onboarded: true,
  //     platforms: { ...userPlatformData.platforms, ...res.platforms },
  //   });
  //   setAllowed(true);
  // };

  // useEffect(() => {
  //   const autoRefresh = setInterval(() => {
  //     reccurentLogin();
  //   }, timeRefreshToken);
  //   return () => {
  //     clearInterval(autoRefresh);
  //   };
  // });

  if ((allowed as any) instanceof Error) return <Navigate to='/dashboardOnboard' />;

  if (!preAllowed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedOnboardRoutes;
