import React, { useEffect, useCallback, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import SpinnerKit from '../kits/spinner/SpinnerKit';
import useApi from '../hooks/useApi';
import usePlatform from '../hooks/usePlatform';
import config from '../setup/config';

export const ProtectedOnboardRoutes = () => {
  const { user } = useUserAuth();
  const { loginAll } = useApi();
  const { setPlatformToken } = usePlatform();
  const flag = useRef(false);
  const { timeRefreshToken } = config;
  const getOnBoardingData = useCallback(async () => {
    const res = await loginAll({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      flag.current = res;
      return;
    }

    flag.current = true;
    setPlatformToken(res.response);
  }, [loginAll, user, setPlatformToken]);

  useEffect(() => {
    const unsubscribe = () => {
      if (flag.current === false) {
        getOnBoardingData();
      }
    };

    return () => {
      unsubscribe();
    };
  }, [getOnBoardingData]);

  useEffect(() => {
    const autoRefresh = setInterval(() => {
      getOnBoardingData();
    }, timeRefreshToken);
    return () => {
      clearInterval(autoRefresh);
    };
  });

  if (flag.current === false) {
    return (
      <div style={{ marginTop: '20rem' }}>
        <SpinnerKit />
      </div>
    );
  }
  
  return flag.current instanceof Error ? <Navigate to='/onboarding' /> : <Outlet /> ;
};
