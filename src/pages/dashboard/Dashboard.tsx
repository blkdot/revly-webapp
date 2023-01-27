import { useAtom } from 'jotai';
import { useState } from 'react';
import AvgBasketIcon from '../../assets/images/ic_avg-basket.png';
import DiscountOfferedIcon from '../../assets/images/ic_marketing.png';
import RevenueIcon from '../../assets/images/ic_offers-mn.png';
import ProfitIcon from '../../assets/images/ic_offers-pr.png';
import OrdersIcon from '../../assets/images/ic_orders.png';
import RoiIcon from '../../assets/images/ic_roi.png';
import Dates from '../../components/dates/Dates';
import Finance from '../../components/finance/Finance';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import Marketing from '../../components/marketing/Marketing';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import RestaurantDropdownNew from '../../components/restaurantDropdown/RestaurantDropdownNew';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';
import Table from '../../components/table/Table';
import TableEmpty from '../../components/table/TableEmpty';
import useMetrics from '../../hooks/useMetrics';
import PaperKit from '../../kits/paper/PaperKit';
import { vendorsAtom } from '../../store/vendorsAtom';
import './Dashboard.scss';

const Dashboard = () => {
  const { metricsbeforePeriod, metricsafterPeriod, loading } = useMetrics();
  const [vendors] = useAtom(vendorsAtom);
  const { chainObj, vendorsObj, display, vendorsSelected, vendorsArr } = vendors;
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
  const links = ['revenue', 'n_orders', 'average_basket', 'profit', 'accrued_discounts', 'roi'];

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdownNew chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            vendorsSelected={vendorsSelected}
            vendors={vendorsArr}
            vendorsPlatform={Object.keys(vendorsObj)}
          />
        )}
        <Dates isDashboard />
      </div>
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 && !loading ? (
        <Finance
          chainObj={chainObj}
          setTable={setTable}
          table={table}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          display={display}
          vendorsSelected={vendorsSelected}
          vendors={vendorsArr}
          loading={loading}
        />
      ) : (
        <FinanceEmpty />
      )}
      {metricsbeforePeriod.length !== 0 && metricsafterPeriod.length !== 0 && !loading ? (
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
      {metricsafterPeriod.length !== 0 && metricsbeforePeriod.length !== 0 && !loading ? (
        <PaperKit className='dashboard-paper-wrapper'>
          <div className='dashboard-links'>
            {links.map((title) => (
              <div
                role='presentation'
                tabIndex={-1}
                onClick={() => setTable(title)}
                className={title === table ? 'active' : ''}
                key={title}
              >
                <img src={getIcon(title)} alt={title} />
                {getTitle(title)}
              </div>
            ))}
            <div className='indicator' />
          </div>
          {links.map((info) =>
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
            )
          )}
        </PaperKit>
      ) : (
        <TableEmpty />
      )}
    </div>
  );
};

export default Dashboard;
