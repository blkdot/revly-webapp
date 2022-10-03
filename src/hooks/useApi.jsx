import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
} from '../api/settingsApi';

import { getMetrics, getVendors } from '../api/userApi';

import { getOffers, getAds } from '../api/planningApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  getMetrics,
  settingsSave,
  getOffers,
  getVendors,
  getAds,
});

export default useApi;
