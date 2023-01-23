import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';

import SpinnerKit from '../kits/spinner/SpinnerKit';

import { useUserAuth } from '../contexts/AuthContext';

import useApi from '../hooks/useApi';
import { usePlatform } from '../hooks/usePlatform';

import config from '../setup/config';

import ContainerKit from '../kits/container/ContainerKit';
import Navbar from '../components/navbar/Navbar';

const ProtectedOnboardRoutes = () => {
  const [allowed, setAllowed] = useState(false);
  const [preAllowed, setPreAllowed] = useState(false);
  const { user } = useUserAuth();
  const { settingsLogin, settingsOnboarded } = useApi();
  const { userPlatformData, cleanPlatformData, setUserPlatformData } = usePlatform();
  const { timeRefreshToken } = config;
  const location = useLocation();
  const navigate = useNavigate();

  const getPlatformData = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const res = await settingsOnboarded({
        master_email: user.email,
        access_token: user.accessToken,
      });

      if (res instanceof Error || !res.onboarded || !res.platforms) throw new Error('');

      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...res.platforms },
      });

      setPreAllowed(true);
    } catch (error) {
      setAllowed(error);
    }
  };

  useEffect(() => {
    getPlatformData();
  }, []);

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

  if (allowed instanceof Error) return <Navigate to="/onboarding" />;

  if (!allowed || !preAllowed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return (
    <div className="user-page">
      <Navbar />
      <ContainerKit>
        <Outlet />
      </ContainerKit>
    </div>
  );
};

export default ProtectedOnboardRoutes;
