import { settingsOnboardPlatform, settingsOnboarded, settingsLogin } from '../api/settingsApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
});

export default useApi;
