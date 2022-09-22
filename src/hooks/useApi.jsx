import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
} from '../api/settingsApi';

import { getMetrics, getVendors } from '../api/userApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  getMetrics,
  settingsSave,
  getVendors,
});

export default useApi;
