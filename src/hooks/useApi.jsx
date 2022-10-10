import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
  settingsLoad,
} from '../api/settingsApi';

import { getMetrics, getVendors, getMenu } from '../api/userApi';

import { getOffers, getAds } from '../api/planningApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsLoad,
  getMetrics,
  settingsSave,
  getMenu,
  getOffers,
  getVendors,
  getAds,
});

export default useApi;
