import { settingsOnboarded } from 'api/settingsApi';
import RestaurantDropdownEmpty from 'components/restaurantDropdown/RestaurantDropdownEmpty';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import { useUserAuth } from 'contexts';
import { usePlatform } from 'hooks';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dates from '../../components/dates/Dates';
import FinanceEmpty from '../../components/finance/FinanceEmpty';
import MarketingEmpty from '../../components/marketing/MarketingEmpty';
import TableEmpty from '../../components/table/TableEmpty';
import './Dashboard.scss';

const DashboardOnboard = () => {
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
  const { user } = useUserAuth();
  const { userPlatformData, setUserPlatformData } = usePlatform();
  const onboard = async () => {
    const res = await settingsOnboarded({
      master_email: user.email,
      access_token: user.accessToken,
    });

    setUserPlatformData({
      onboarded: res.onboarded,
      platforms: { ...userPlatformData.platforms, ...res.platforms },
    });
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (userPlatformData.onboarded) {
      navigate('/dashboard');
    }
    onboard();
  }, [branchData]);
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdownEmpty />
        <Dates isDashboard />
      </div>
      <div className='dashboard-stepper'>
        <OnboardingModal propsVariables={propsVariables} />
        <OnboardingStepper
          activeStep={activeStep}
          accounts={accounts}
          openCloseModal={openCloseModal}
        />
      </div>
      <FinanceEmpty />
      <MarketingEmpty />
      <TableEmpty />
    </div>
  );
};

export default DashboardOnboard;
