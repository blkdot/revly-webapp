import React, { useState } from 'react';
import Dates from '../../components/dates/Dates';
import PlanningAdsTable from '../../components/planningAdsTable/PlanningAdsTable';
import PlanningOffersTable from '../../components/planningOffersTable/PlanningOffersTable';
import PlanningOffersTableEmpty from '../../components/planningOffersTable/PlanningOffersTableEmpty';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import useDate from '../../hooks/useDate';
import usePlanningOffers from '../../hooks/usePlanningOffers';
import usePlanningAds from '../../hooks/usePlanningAds';
import useVendors from '../../hooks/useVendors';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Planning.scss';

const Planning = () => {
  const [active, setActive] = useState(1);
  const { dateFromContext: dateFrom } = useDate();
  const [dateRange, setDateRange] = useState({
    start: dateFrom.startDate,
    end: dateFrom.endDate,
  });

  const { vendors, vendorsPlatform } = useVendors();
  const { offers } = usePlanningOffers({ dateRange });
  const { ads } = usePlanningAds({ dateRange });

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
        <Dates dateFromBtn={dateRange} setdateFromBtn={setDateRange} />
      </div>
      <div className={`planning_top-nav ${!active ? 'active' : ''}`}>
        <TypographyKit className={active ? 'active' : ''} onClick={() => setActive(1)} variant="h4">
          Offers
        </TypographyKit>
        <TypographyKit
          className={!active ? 'active' : ''}
          onClick={() => setActive(0)}
          variant="h4">
          Ads
        </TypographyKit>
      </div>
      {active ? getOffersTable() : <PlanningAdsTable rows={ads} />}
    </div>
  );
};

export default Planning;
