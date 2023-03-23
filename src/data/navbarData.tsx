import { ReactComponent as DashboardIcon } from 'assets/linkIcons/dashboard.svg';
import { ReactComponent as PlanningIcon } from 'assets/linkIcons/planning.svg';
import { ReactComponent as OffersIcon } from 'assets/linkIcons/offers.svg';
import { ReactComponent as AdvertsIcon } from 'assets/linkIcons/adverts.svg';
import { ReactComponent as ListingIcon } from 'assets/linkIcons/listing.svg';
import { ReactComponent as Alerts } from 'assets/linkIcons/alerts.svg';

export const simpleLink = [
  { title: 'Dashboard', path: '/dashboard', image: <DashboardIcon /> },
  { title: 'Planning', path: '/planning', image: <PlanningIcon /> },
  { title: 'Offers', path: '/offer', image: <OffersIcon /> },
  { title: 'Adverts', path: '/adverts', image: <AdvertsIcon /> },
  { title: 'Listing', path: '/listing', image: <ListingIcon /> },
  { title: 'Alerts', path: '/alerts', image: <Alerts /> },
];

export const settingsLink = [
  { title: 'General', path: '/settings/general' },
  { title: 'Onboarding', path: '/settings/onboarding' },
  // { title: 'Change Password', path: '/settings/change-password' },
  { title: 'Menu Settings', path: '/settings/menu' },
  { title: 'Cost Settings', path: '/settings/cost' },
];
