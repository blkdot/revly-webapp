import adsIcon from '../assets/images/ic_ads.png';
import alertsIcon from '../assets/images/ic_alerts.png';
import competitionIcon from '../assets/images/ic_competiton.png';
import dashboardIcon from '../assets/images/ic_dashboard.png';
import marketingIcon from '../assets/images/ic_marketing.png';
import offerIcon from '../assets/images/ic_offers.png';
import planningIcon from '../assets/images/ic_planning.png';
import rankingIcon from '../assets/images/ic_ranking.png';

export const simpleLink = [
  { title: 'Dashboard', path: '/dashboard', src: dashboardIcon },
  { title: 'Planning', path: '/planning', src: planningIcon },
];

export const accordionLink = [
  {
    id: 'marketing',
    title: ' Marketing',
    src: marketingIcon,
    subs: [
      { title: 'Offers', path: '/marketing/offer', src: offerIcon },
      { title: 'Ads', path: '/marketing/ads', src: adsIcon },
    ],
  },
  {
    id: 'competition',
    title: ' Competition',
    src: competitionIcon,
    subs: [
      { title: 'Listing', path: '/competition/listing', src: rankingIcon },
      { title: 'Alerts', path: '/competition/alerts', src: alertsIcon },
    ],
  },
];
