import { useSettingsOnboarded } from 'api/settingsApi';
import { usePlatform } from 'hooks';
import { SpinnerKit } from 'kits';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getElligibilityDeliveroo } from 'api/elligibilityDeliverooApi';
import { elligibilityDeliverooAtom } from 'store/eligibilityDeliveroo';
import { vendorsAtom } from 'store/vendorsAtom';
import { useAtom } from 'jotai';
import { useUser } from './ProtectedRoutes';

export const ProtectedOnboardRoutes = () => {
  const user = useUser();
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const [vendors] = useAtom(vendorsAtom);
  const [eligibilityDeliverooState, setEligibilityDeliverooState] =
    useAtom(elligibilityDeliverooAtom);

  const response = useSettingsOnboarded({
    master_email: user.email,
    access_token: user.token,
  });

  const requestEligibilityDeliveroo = async () => {
    const result = await getElligibilityDeliveroo({
      master_email: user.email,
      access_token: user.token,
      chain_id: '',
      vendors: [vendors.vendorsObj.deliveroo.filter((v) => v.metadata.is_active)[0]],
    });

    if (result.data) {
      setEligibilityDeliverooState(result.data);
    }
  };

  useEffect(() => {
    if (Object.keys(eligibilityDeliverooState).length < 1 && vendors.chainData.length > 0) {
      requestEligibilityDeliveroo();
    }
  }, [vendors]);

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
