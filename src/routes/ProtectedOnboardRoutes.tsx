import { useUserAuth } from 'contexts';
import { useApi, usePlatform } from 'hooks';
import { SpinnerKit } from 'kits';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedOnboardRoutes = () => {
  const [allowed, setAllowed] = useState<any>(false);
  const [preAllowed, setPreAllowed] = useState(false);
  const { user } = useUserAuth();
  const { settingsOnboarded } = useApi();
  const { userPlatformData, setUserPlatformData } = usePlatform();

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

  if ((allowed as any) instanceof Error) return <Navigate to='/dashboardOnboard' />;

  if (!preAllowed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedOnboardRoutes;
