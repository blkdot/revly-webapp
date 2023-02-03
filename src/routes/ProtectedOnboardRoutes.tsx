import { useUserAuth } from 'contexts';
import { SpinnerKit } from 'kits';
import { useEffect, useState } from 'react';
import {  Outlet, useLocation } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { usePlatform } from '../hooks/usePlatform';
import config from '../setup/config';

const ProtectedOnboardRoutes = () => {
  const [allowed, setAllowed] = useState<boolean>(false);
  const { user } = useUserAuth();
  const { settingsLogin } = useApi();
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  const { timeRefreshToken } = config;
  const location = useLocation();

  const reccurentLogin = async () => {
    try {
      const res = await settingsLogin({
        master_email: user.email,
        access_token: user.accessToken,
      });
  
      if (res instanceof Error || !res.onboarded) {
        cleanPlatformData();
        return;
      }
  
      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...res.platforms },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAllowed(true);
    }
  };

  useEffect(() => {
    if (!userPlatformData.onboarded) {
      reccurentLogin();
    }

    setAllowed(true);
  }, [location]);

  useEffect(() => {
    const autoRefresh = setInterval(() => {
      reccurentLogin();
    }, timeRefreshToken);
    return () => {
      clearInterval(autoRefresh);
    };
  });

  if (!allowed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedOnboardRoutes;
