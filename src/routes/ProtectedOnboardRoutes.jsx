import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

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

  useEffect(() => {
    if (!userPlatformData.onboarded) {
      setAllowed(new Error(''));
    }

    setAllowed(true);
  }, []);

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

    setUserPlatformData(res);
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

  return allowed instanceof Error ? <Navigate to="/onboarding" /> : <Outlet />;
};

export default ProtectedOnboardRoutes;
