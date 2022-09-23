import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
} from '../api/settingsApi';

import { getMetrics, getVendors } from '../api/userApi';

import { getOffers } from '../api/marketingApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  getMetrics,
  settingsSave,
  getOffers,
  getVendors,
});

export default useApi;
