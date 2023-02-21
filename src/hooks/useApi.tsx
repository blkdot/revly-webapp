import {
  getAlerts,
  getAreas,
  getCompetitors,
  getRanking,
  getCuisines,
} from '../api/competitionApi';
import { cancelOffer, cancelOfferMaster, triggerOffers } from '../api/marketingApi';
import { getAds, getOffers } from '../api/planningApi';
import {
  settingsLoad,
  settingsLogin,
  settingsOnboarded,
  settingsOnboardPlatform,
  settingsOnboardPlatformStatus,
  settingsSave,
} from '../api/settingsApi';
import { getHeatmap, getMenu, getMetrics, getOfferDetails, getVendors } from '../api/userApi';

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
  cancelOfferMaster,
  getAreas,
  getCuisines,
});

export default useApi;
