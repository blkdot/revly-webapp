import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import RestaurantDropdownEmpty from 'components/restaurantDropdown/RestaurantDropdownEmpty';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import { useMetrics, usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import { PaperKit } from 'kits';
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
import Table from '../../components/table/Table';
import TableEmpty from '../../components/table/TableEmpty';
import { vendorsAtom } from '../../store/vendorsAtom';
import './Dashboard.scss';

const Dashboard = () => {
  const { metricsbeforePeriod, metricsafterPeriod, loading } = useMetrics();
  const [vendors] = useAtom(vendorsAtom);
  const { chainObj, display, vendorsSelected, vendorsArr } = vendors;
  const [table, setTable] = useState('revenue');

  const getTitle = (title: string) => {
    if (title === 'n_orders') {
      return 'Orders';
    }
    if (title === 'average_basket') {
      return 'Avg. Basket';
    }
    if (title === 'accrued_discounts') {
      return 'Accrued Discount';
    }
    if (title === 'profit') {
      return 'Net Revenue';
    }
    if (title === 'roi') {
      return 'Marketing ROI';
    }
    return title;
  };
  const getIcon = (title: string) => {
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
  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const openCloseModal = () => {
    setOpenedModal(!openedModal);
    if (connectAccount === 'manageBranch' || connectAccount === 'completed') {
      setConnectAccount('account');
    }
    const body = document.querySelector('body');
    const navbar = document.querySelector('.Navbar');
    if (!openedModal) {
      navbar.classList.add('openedModal');
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const propsVariables = {
    openCloseModal,
    setConnect,
    connect,
    setAccounts,
    accounts,
    setBranchData,
    branchData,
    setBranchDataUploading,
    branchDataUploading,
    setActiveStep,
    activeStep,
    openedModal,
    connectAccount,
    setConnectAccount,
  };
  const { userPlatformData } = usePlatform();
  const getDropdown = () => {
    if (!userPlatformData.onboarded) {
      return <RestaurantDropdownEmpty />;
    }
    return <RestaurantDropdown />;
  };
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        {getDropdown()}
        <Dates isDashboard />
      </div>
      {!userPlatformData.onboarded ? (
        <div className='dashboard-stepper'>
          <OnboardingModal propsVariables={propsVariables} />
          <OnboardingStepper
            activeStep={activeStep}
            accounts={accounts}
            openCloseModal={openCloseModal}
          />
        </div>
      ) : (
        ''
      )}
      {metricsbeforePeriod.length !== 0 &&
      metricsafterPeriod.length !== 0 &&
      !loading &&
      userPlatformData.onboarded ? (
        <Finance
          setTable={setTable}
          table={table}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          display={display}
          vendors={vendorsArr}
          loading={loading}
        />
      ) : (
        <FinanceEmpty />
      )}
      {metricsbeforePeriod.length !== 0 &&
      metricsafterPeriod.length !== 0 &&
      !loading &&
      userPlatformData.onboarded ? (
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
      {metricsafterPeriod.length !== 0 &&
      metricsbeforePeriod.length !== 0 &&
      !loading &&
      userPlatformData.onboarded ? (
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
