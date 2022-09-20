import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import SpinnerKit from '../kits/spinner/SpinnerKit';

import { useUserAuth } from '../contexts/AuthContext';

import useApi from '../hooks/useApi';
import { usePlatform } from '../hooks/usePlatform';

import config from '../setup/config';

const ProtectedOnboardRoutes = () => {
  const [allowed, setAllowed] = useState(false);
  const { user } = useUserAuth();
  const { settingsLogin } = useApi();
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  const { timeRefreshToken } = config;
  const location = useLocation();

  useEffect(() => {
    if (!userPlatformData.onboarded) {
      reccurentLogin();
    }

    setAllowed(true);
  }, [location]);

  const reccurentLogin = async () => {
    const res = await settingsLogin({
      master_email: user.email,
      access_token: user.accessToken,
    });

    if (res instanceof Error || !res.onboarded) {
      cleanPlatformData();
      setAllowed(new Error(''));
      return;
    }

    setUserPlatformData({
      onboarded: true,
      platforms: { ...userPlatformData.platforms, ...res.platforms },
    });
    setAllowed(true);
  };

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

  return allowed instanceof Error ? <Navigate to="/check" /> : <Outlet />;
};

export default ProtectedOnboardRoutes;
