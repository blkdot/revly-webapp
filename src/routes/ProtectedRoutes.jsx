import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

import SpinnerKit from '../kits/spinner/SpinnerKit';

export const ProtectedRoutes = () => {
  const { user } = useUserAuth();

  console.log(`User Protected: ${user}`, typeof user);

  if (typeof user === 'boolean' && user) {
    return (
      <div style={{ marginTop: '20rem' }}>
        <SpinnerKit />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to='/' />;
};
