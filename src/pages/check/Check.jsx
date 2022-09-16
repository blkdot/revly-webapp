import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserAuth } from '../../contexts/AuthContext';

import useApi from '../../hooks/useApi';
import { usePlatform } from '../../hooks/usePlatform';

import SpinnerKit from '../../kits/spinner/SpinnerKit';

const Check = () => {
  const { settingsOnboarded } = useApi();
  const navigate = useNavigate();
  const { setUserPlatformData } = usePlatform();
  const { user } = useUserAuth();

  const getPlatformData = async () => {
    if (!user) return navigate('/');

    const res = await settingsOnboarded({
      master_email: user.email,
      access_token: user.accessToken,
    });

    if (res instanceof Error || !res.onboarded) return navigate('/onboarding');

    setUserPlatformData(res);

    return navigate('/dashboard');
  };

  useEffect(() => {
    const unsubscribe = () => {
      getPlatformData();
    };

    return () => {
      unsubscribe();
    };
  }, [JSON.stringify(user)]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
    </div>
  );
};

export default Check;
