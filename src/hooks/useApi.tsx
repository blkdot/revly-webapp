import {
  getAlerts,
  getAreas,
  getCompetitors,
  getCuisines,
  getRanking,
} from '../api/competitionApi';
import { cancelOffer, cancelOfferMaster, triggerOffers } from '../api/marketingApi';
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
  getCompetitors,
  getAlerts,
  getVendors,
  getHeatmap,
  getOfferDetails,
  cancelOffer,
  triggerOffers,
  cancelOfferMaster,
  getAreas,
  getCuisines,
});

export default useApi;
