import React, { useEffect, useCallback, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import useApi from '../hooks/useApi';
import usePlatform from '../hooks/usePlatform';
import config from '../setup/config';

export const ProtectedOnboardRoutes = () => {
  const { user } = useUserAuth();
  const { loginExist, loginAll } = useApi();
  const { setPlatformToken } = usePlatform();
  const flag = useRef(false);
  const { timeRefreshToken } = config;
  const getOnBoardingData = useCallback(async () => {
    const res = await loginExist({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      flag.current = res;
      return;
    }

    if (!res.response.registered) {
      flag.current = new Error();
      return;
    }

    flag.current = true;
    setPlatformToken(res.response.platforms);
  }, [loginExist, user, setPlatformToken]);

  const refreshToken = async () => {
    const res = await loginAll({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      flag.current = res;
      return;
    }

    setPlatformToken(res.response);
  };

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
      refreshToken();
    }, timeRefreshToken);
    return () => {
      clearInterval(autoRefresh);
    };
  });
  
  return flag.current instanceof Error ? <Navigate to='/onboarding' /> : <Outlet /> ;
};
