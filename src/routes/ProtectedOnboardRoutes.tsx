import { useSettingsOnboarded } from 'api/settingsApi';
import { usePlatform } from 'hooks';
import { SpinnerKit } from 'kits';
import { useEffect, useCallback } from 'react';
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
  const { chainData } = vendors;
  const [, setEligibilityDeliverooState] = useAtom(elligibilityDeliverooAtom);

  const response = useSettingsOnboarded({
    master_email: user.email,
    access_token: user.token,
  });

  const requestEligibilityDeliveroo = useCallback(() => {
    const reqEligibilities = userPlatformData.platforms.deliveroo.map((platformData) => {
      const vendorIds = platformData.vendor_ids;

      const firstVendorData = chainData.find(
        (chain) =>
          vendorIds.includes(String(chain.vendor_id)) &&
          chain.platform.toLocaleLowerCase() === 'deliveroo'
      );

      if (!firstVendorData) return null;

      return getElligibilityDeliveroo({
        master_email: user.email,
        access_token: user.token,
        chain_id: '',
        vendors: [firstVendorData?.data],
      });
    });

    Promise.all(reqEligibilities).then((responses) => {
      responses.forEach((res) => {
        setEligibilityDeliverooState((prev) => ({ ...prev, ...res.data }));
      });
    });
  }, [JSON.stringify(vendors.chainData), JSON.stringify(userPlatformData.platforms.deliveroo)]);

  useEffect(() => {
    if (
      vendors.chainData.length > 0 &&
      userPlatformData.platforms.deliveroo.length > 0 &&
      !response.isLoading &&
      user
    ) {
      requestEligibilityDeliveroo();
    }
  }, [requestEligibilityDeliveroo]);

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
