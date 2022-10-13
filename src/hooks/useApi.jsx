import {
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsSave,
  settingsLoad,
} from '../api/settingsApi';

import { getMetrics, getVendors, getHeatmap, getMenu, getOfferDetails } from '../api/userApi';

import { getOffers, getAds } from '../api/planningApi';

import { getCompetitors, getAlerts } from '../api/competitionApi';

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
  getCompetitors,
  getAlerts,
  getVendors,
  getAds,
  getHeatmap,
  getOfferDetails,
});

export default useApi;
