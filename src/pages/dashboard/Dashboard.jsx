import './Dashboard.scss';
import React, { useState } from 'react';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';
import Marketing from '../../components/marketing/Marketing';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown.suspended';
import useMetrics from '../../hooks/useMetrics';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import Table from '../../components/table/Table';
import TableEmpty from '../../components/table/TableEmpty';
import PaperKit from '../../kits/paper/PaperKit';
import RevenueIcon from '../../assets/images/ic_offers-mn.png';
import OrdersIcon from '../../assets/images/ic_orders.png';
import ProfitIcon from '../../assets/images/ic_offers-pr.png';
import AvgBasketIcon from '../../assets/images/ic_avg-basket.png';
import DiscountOfferedIcon from '../../assets/images/ic_marketing.png';
import RoiIcon from '../../assets/images/ic_roi.png';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';
import useDate from '../../hooks/useDate';

const Dashboard = () => {
  const { metricsbeforePeriod, metricsafterPeriod, loading } = useMetrics();
  const { vendors } = useDate();
  const { chainObj, vendorsObj, display, restaurants, vendorsArr } = vendors;
  const [table, setTable] = useState('revenue');

  const getTitle = (title) => {
    if (title === 'n_orders') {
      return 'orders';
    }
    if (title === 'average_basket') {
      return 'Avg.basket';
    }
    if (title === 'accrued_discounts') {
      return 'Discount offered';
    }
    if (title === 'profit') {
      return 'net revenue';
    }
    return title;
  };
  const getIcon = (title) => {
    if (title === 'revenue') {
      return RevenueIcon;
    }
    if (title === 'n_orders') {
      return OrdersIcon;
    }
    if (title === 'profit') {
      return ProfitIcon;
    }
    if (title === 'average_basket') {
      return AvgBasketIcon;
    }
    if (title === 'accrued_discounts') {
      return DiscountOfferedIcon;
    }
    return RoiIcon;
  };

  return (
    <div className="wrapper">
      <div className="top-inputs">
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdown chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            restaurants={restaurants}
            vendors={vendorsArr}
            vendorsPlatform={Object.keys(vendorsObj)}
          />
        )}
        <Dates isDashboard />
      </div>
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 ? (
        <Finance
          chainObj={chainObj}
          setTable={setTable}
          table={table}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          display={display}
          restaurants={restaurants}
          vendors={vendorsArr}
          loading={loading}
        />
      ) : (
        <FinanceEmpty />
      )}
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 ? (
        <Marketing
          setTable={setTable}
          table={table}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          loading={loading}
        />
      ) : (
        <MarketingEmpty />
      )}
      {metricsafterPeriod.length !== 0 && metricsbeforePeriod.length !== 0 ? (
        <PaperKit className="dashboard-paper-wrapper">
          <div className="dashboard-links">
            {['revenue', 'n_orders', 'average_basket', 'profit', 'accrued_discounts', 'roi'].map(
              (title) => (
                <div
                  role="presentation"
                  tabIndex={-1}
                  onClick={() => setTable(title)}
                  className={title === table ? 'active' : ''}
                  key={title}
                >
                  <img src={getIcon(title)} alt={title} />
                  {getTitle(title)}
                </div>
              ),
            )}
            <div className="indicator" />
          </div>
          {['revenue', 'n_orders', 'average_basket', 'profit', 'accrued_discounts', 'roi'].map(
            (info) =>
              info === table ? (
                <Table
                  key={info}
                  title={info}
                  metricsafterPeriod={metricsafterPeriod}
                  metricsbeforePeriod={metricsbeforePeriod}
                  loading={loading}
                />
              ) : (
                ''
              ),
          )}
        </PaperKit>
      ) : (
        <TableEmpty />
      )}
    </div>
  );
};

export default Dashboard;
