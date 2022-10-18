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
  const { metricsbeforePeriod, metricsafterPeriod } = useMetrics();
  const { vendors, vendorsPlatform } = useVendors();

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates isDashboard />
      </div>
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 ? (
        <Finance
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          vendors={vendors}
        />
      ) : (
        <FinanceEmpty vendors={vendors} />
      )}
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 ? (
        <Marketing
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
        />
      ) : (
        <MarketingEmpty />
      )}
    </div>
  );
};

export default Dashboard;
