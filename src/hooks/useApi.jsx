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

import { getCompetitors, getAlerts, getRanking, getAreas } from '../api/competitionApi';

import {
  triggerOffers,
  cancelOffer,
  OfferCrossPlatforms,
  cancelOfferMaster,
} from '../api/marketingApi';

const useApi = () => ({
  settingsOnboardPlatform,
  settingsOnboarded,
  settingsLogin,
  settingsOnboardPlatformStatus,
  settingsLoad,
  getMetrics,
  getRanking,
  settingsSave,
  getMenu,
  getOffers,
  getCompetitors,
  getAlerts,
  getVendors,
  getAds,
  getHeatmap,
  getOfferDetails,
  cancelOffer,
  triggerOffers,
  OfferCrossPlatforms,
  cancelOfferMaster,
  getAreas,
});

export default useApi;
