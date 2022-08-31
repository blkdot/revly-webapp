import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import SpinnerKit from '../kits/spinner/SpinnerKit';
import useApi from '../hooks/useApi';

export const ProtectedOnboardRoutes = () => {
  const { user } = useUserAuth();
  const { loginAll } = useApi();

  useEffect(() => {
    if (typeof user !== 'boolean' && user) {
      getOnBoardingData();
    }
  }, [user]);

  const getOnBoardingData = async () => {
    const res = await loginAll({ master_email: user.email, access_token: user.access_token });
  };
  

  if (typeof user === 'boolean' && user) {
    return (
      <div style={{ marginTop: '20rem' }}>
        <SpinnerKit />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to='/' />;
};
