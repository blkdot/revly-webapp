import React, { useEffect, useCallback, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import SpinnerKit from '../kits/spinner/SpinnerKit';
import useApi from '../hooks/useApi';
import usePlatform from '../hooks/usePlatform';

export const ProtectedOnboardRoutes = () => {
  const { user } = useUserAuth();
  const { loginAll } = useApi();
  const { setPlatformToken } = usePlatform();
  const flag = useRef(false);
  console.log(user);
  const getOnBoardingData = useCallback(async () => {
    const res = await loginAll({ master_email: user.email, access_token: user.accessToken });

    if (res instanceof Error) {
      flag.current = res;
      return;
    }

    setPlatformToken(res.response);
  }, [loginAll, user, setPlatformToken]);

  useEffect(() => {
    const unsubscribe = () => {
      getOnBoardingData();
    };

    return () => {
      unsubscribe();
    };
  }, [getOnBoardingData]);

  if (!flag) {
    return (
      <div style={{ marginTop: '20rem' }}>
        <SpinnerKit />
      </div>
    );
  }

  return flag.current instanceof Error ? <Navigate to='/onboarding' /> : <Outlet /> ;
};
