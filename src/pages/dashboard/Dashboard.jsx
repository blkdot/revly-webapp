import './Dashboard.scss';
import React from 'react';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';
import Marketing from '../../components/marketing/Marketing';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
// import { restaurantNames } from '../../data/fakeDataDashboard';
import useMetrics from '../../hooks/useMetrics';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import useVendors from '../../hooks/useVendors';

const Dashboard = () => {
  const { metricsLeft, metricsRight } = useMetrics();
  const { vendors, vendorsPlatform } = useVendors();
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates />
      </div>
      {metricsLeft.length !== 0 && metricsRight.length !== 0 ? (
        <Finance metricsLeft={metricsLeft} metricsRight={metricsRight} vendors={vendors} />
      ) : (
        <FinanceEmpty vendors={vendors} />
      )}
      {metricsLeft.length !== 0 && metricsRight.length !== 0 ? (
        <Marketing metricsLeft={metricsLeft} metricsRight={metricsRight} />
      ) : (
        <MarketingEmpty />
      )}
    </div>
  );
};

export default Dashboard;
