import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
  settingsLoad,
} from '../api/settingsApi';

import { getMetrics, getVendors, getHeatmap } from '../api/userApi';

import { getOffers, getAds } from '../api/planningApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsLoad,
  getMetrics,
  settingsSave,
  getOffers,
  getVendors,
  getAds,
  getHeatmap,
});

export default useApi;
