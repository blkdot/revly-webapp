import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useUserAuth } from '../contexts/AuthContext';
import SpinnerKit from '../kits/spinner/SpinnerKit';
import ContainerKit from '../kits/container/ContainerKit';
import Navbar from '../components/navbar/Navbar';

const ProtectedRoutes = () => {
  const { user } = useUserAuth();

  if (typeof user === 'boolean' && user) {
    return (
      <div style={{ marginTop: '20rem', marginLeft: '45%' }}>
        <SpinnerKit />
      </div>
    );
  }

  const renderLayout = () => (
    <div className="user-page">
      <Navbar />
      <ContainerKit>
        <Outlet />
      </ContainerKit>
    </div>
  );

  return user ? renderLayout() : <Navigate to="/" />;
};

export default ProtectedRoutes;
