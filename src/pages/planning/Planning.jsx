import React, { useState } from 'react';
import Dates from '../../components/dates/Dates';
import PlanningAdsTable from '../../components/planningAdsTable/PlanningAdsTable';
import PlanningOffersTable from '../../components/planningOffersTable/PlanningOffersTable';
import PlanningOffersTableEmpty from '../../components/planningOffersTable/PlanningOffersTableEmpty';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import { PlanningAdsData } from '../../data/fakeDataDashboard';
import useMarketingOffers from '../../hooks/useMarketingOffers';
import useVendors from '../../hooks/useVendors';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Planning.scss';

const Planning = () => {
  const [active, setActive] = useState(true);
  const { offers } = useMarketingOffers();
  const { vendors, vendorsPlatform } = useVendors();
  const getOffersTable = () => {
    if (offers.length === 0) {
      return <PlanningOffersTableEmpty />;
    }
    return <PlanningOffersTable rows={offers} />;
  };
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates />
      </div>
      <div className={`planning_top-nav ${!active ? 'active' : ''}`}>
        <TypographyKit
          className={active ? 'active' : ''}
          onClick={() => setActive(true)}
          variant="h4">
          Offers
        </TypographyKit>
        <TypographyKit
          className={!active ? 'active' : ''}
          onClick={() => setActive(false)}
          variant="h4">
          Ads
        </TypographyKit>
      </div>
      {active ? getOffersTable() : <PlanningAdsTable rows={PlanningAdsData} />}
    </div>
  );
};

export default Planning;
