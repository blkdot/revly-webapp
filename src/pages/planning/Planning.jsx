import React, { useState } from 'react';
import Dates from '../../components/dates/Dates';
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
  const { date } = useDate();
  const [dateRange, setDateRange] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
  const { vendors, vendorsPlatform } = useVendors();
  const { offers, isLoading: isLoadingOffers } = usePlanningOffers({ dateRange });
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange });

  const getOffersTable = () => {
    if (isLoadingOffers) {
      return <PlanningOffersTableEmpty />;
    }

    return <PlanningOffersTable type="offer" rows={offers} />;
  };

  const getAdsTable = () => {
    if (isLoadingAds) {
      return <PlanningOffersTableEmpty />;
    }

    return <PlanningOffersTable type="ad" rows={ads} />;
  };

  const renderTable = () => {
    if (active) return getOffersTable();

    return getAdsTable();
  };

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates offer beforePeriodBtn={dateRange} setbeforePeriodBtn={setDateRange} />
      </div>
      <div className={`planning_top-nav ${!active ? 'active' : ''}`}>
        <TypographyKit className={active ? 'active' : ''} onClick={() => setActive(1)} variant="h4">
          Offers
        </TypographyKit>
        <TypographyKit
          className={!active ? 'active' : ''}
          onClick={() => setActive(0)}
          variant="h4"
        >
          Ads
        </TypographyKit>
      </div>
      {renderTable()}
    </div>
  );
};

export default Planning;
