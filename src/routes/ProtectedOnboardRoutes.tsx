import { getElligibilityDeliveroo } from 'api/elligibilityDeliverooApi';
import { useSettingsOnboarded } from 'api/settingsApi';
import { usePlatform, useUser } from 'contexts';
import { useAtom } from 'jotai';
import { SpinnerKit } from 'kits';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { elligibilityDeliverooAtom } from 'store/eligibilityDeliveroo';
import { vendorsAtom } from 'store/vendorsAtom';

export const ProtectedOnboardRoutes = () => {
  const user = useUser();
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const [vendors] = useAtom(vendorsAtom);
  const { chainData } = vendors;
  const [, setEligibilityDeliverooState] = useAtom(elligibilityDeliverooAtom);

  const response = useSettingsOnboarded(
    {
      master_email: user.email,
      access_token: user.token,
    },
    {
      launcher: 'ProtectedOnboardRoutes',
      user,
    }
  );

  const requestEligibilityDeliveroo = () => {
    try {
      const selectedChainData = [];
      userPlatformData.platforms.deliveroo.forEach((platformData) => {
        const vendorIds = platformData.vendor_ids;

        vendorIds.forEach((vendorId) => {
          const firstVendorData = chainData.find(
            (chain) =>
              vendorId === chain.vendor_id && chain.platform.toLocaleLowerCase() === 'deliveroo'
          );

          if (!firstVendorData) return;

          selectedChainData.push(firstVendorData);
        });
      });

      const reqEligibilities = selectedChainData
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t?.data.data.chain_name === value?.data.data.chain_name ||
                t?.data.chain_id === value?.data.chain_id
            )
        )
        .map((chain) =>
          getElligibilityDeliveroo({
            master_email: user.email,
            access_token: user.token,
            chain_id: String(chain?.data.chain_id),
            vendors: [chain?.data],
          })
        );

      Promise.all(reqEligibilities).then((responses) => {
        responses.forEach((res) => {
          setEligibilityDeliverooState((prev) => ({ ...prev, ...res?.data }));
        });
      });
    } catch (error) {
      setEligibilityDeliverooState((prev) => ({ ...prev }));
    }
  };

  useEffect(() => {
    if (chainData.length > 0) {
      setInterval(requestEligibilityDeliveroo, 900 * 1000);
      const int = setInterval(requestEligibilityDeliveroo, 1000);
      setTimeout(() => clearInterval(int), 1000);
    }
  }, [chainData]);

  // TODO: replace it with a better approach
  // extend useSettingsOnboarded to include react-query options and add a hook for onSuccess
  useEffect(() => {
    if (response?.data) {
      setUserPlatformData({
        onboarded: false,
        platforms: { ...userPlatformData.platforms, ...response?.data.platforms },
      });
    }
  }, [JSON.stringify(response?.data)]);
  const location = useLocation();
  if (
    !response?.isLoading &&
    location.pathname !== '/dashboard' &&
    (response?.isError || !response?.data?.onboarded || !response?.data?.platforms)
  ) {
    return <Navigate to='/dashboard' />;
  }

  if (response?.isLoading) {
    return (
      <div className='main-loading'>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return <Outlet />;
};
