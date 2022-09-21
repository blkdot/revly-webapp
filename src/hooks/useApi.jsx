import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  getMetrics,
  settingsSave,
} from '../api/settingsApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  getMetrics,
  settingsSave,
});

export default useApi;
