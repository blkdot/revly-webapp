import { useSettingsOnboarded } from 'api/settingsApi';
import { usePlatform } from 'hooks';
import { SpinnerKit } from 'kits';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './ProtectedRoutesNew';

const ProtectedOnboardRoutes = () => {
  const user = useUser();
  const { userPlatformData, setUserPlatformData } = usePlatform();

  const response = useSettingsOnboarded({
    master_email: user.email,
    access_token: user.token,
  });

  // TODO: replace it with a better approach
  // extend useSettingsOnboarded to include react-query options and add a hook for onSuccess
  useEffect(() => {
    if (response.data) {
      setUserPlatformData({
        onboarded: true,
        platforms: { ...userPlatformData.platforms, ...response.data.platforms },
      });
    }
  }, [response.data, setUserPlatformData]);

  if (
    response.isError ||
    (response.isSuccess && (!response.data.onboarded || !response.data.platforms))
  ) {
    return <Navigate to='/dashboardOnboard' />;
  }

  if (response.isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedOnboardRoutes;
