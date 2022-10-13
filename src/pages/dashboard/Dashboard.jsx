import './Dashboard.scss';
import React from 'react';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';
import Marketing from '../../components/marketing/Marketing';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import useMetrics from '../../hooks/useMetrics';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import useVendors from '../../hooks/useVendors';

const Dashboard = () => {
  const { metricsDateFrom, metricsCompareDateValue } = useMetrics();
  const { vendors, vendorsPlatform } = useVendors();

  console.log(metricsDateFrom);
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates isDashboard />
      </div>
      {metricsDateFrom.length !== 0 && metricsCompareDateValue.length !== 0 ? (
        <Finance
          metricsDateFrom={metricsDateFrom}
          metricsCompareDateValue={metricsCompareDateValue}
          vendors={vendors}
        />
      ) : (
        <FinanceEmpty vendors={vendors} />
      )}
      {metricsDateFrom.length !== 0 && metricsCompareDateValue.length !== 0 ? (
        <Marketing
          metricsDateFrom={metricsDateFrom}
          metricsCompareDateValue={metricsCompareDateValue}
        />
      ) : (
        <MarketingEmpty />
      )}
    </div>
  );
};

export default Dashboard;
