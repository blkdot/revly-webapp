import React, { useEffect, useCallback, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import useApi from '../hooks/useApi';
import usePlatform from '../hooks/usePlatform';

import config from '../setup/config';

export const ProtectedOnboardRoutes = () => {
  const [flag, setFlag] = useState(false);
  const { user } = useUserAuth();
  const { loginExist, loginAll } = useApi();
  const { setPlatformToken, setIsOnboarded, isOnboarded } = usePlatform();
  const { timeRefreshToken } = config;

  const getPlatformToken = useCallback(async () => {
    const res = await loginAll({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      setFlag(res);
      return;
    }

    setPlatformToken(res.response);
  }, [loginAll, setPlatformToken, user.email, user.accessToken]);

  const checkIfRegistered = useCallback(async () => {
    console.log(isOnboarded);
    if (isOnboarded) return;

    const res = await loginExist({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      setFlag(res);
      return;
    }

    if (!res.response.registered) {
      setFlag(new Error('Not registered'));
      return;
    }

    setFlag(true);
    setIsOnboarded(true);
    getPlatformToken();
  }, [loginExist, user, getPlatformToken, setIsOnboarded, isOnboarded]);

  useEffect(() => {
    const unsubscribe = () => {
      if (flag === false || !isOnboarded) {
        checkIfRegistered();
      }
    };

    return () => {
      unsubscribe();
    };
  }, [checkIfRegistered, flag, isOnboarded]);

  useEffect(() => {
    const autoRefresh = setInterval(() => {
      if (flag) {
        getPlatformToken();
      }
    }, timeRefreshToken);
    return () => {
      clearInterval(autoRefresh);
    };
  });

  return flag instanceof Error ? <Navigate to='/onboarding' /> : <Outlet />;
};
