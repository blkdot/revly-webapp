import { useState, useEffect } from 'react';
import { loadUser } from 'api/userApi';
import { useUserAuth } from 'contexts/AuthContext';
import useVendors from 'hooks/useVendors';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import OnboardingMiddleContent from 'components/settings/onboarding/OnboardingMiddleContent';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingTable from 'components/settings/onboarding/OnboardingTable';
import { usePlatform } from '../../../hooks/usePlatform';
import './SettingOnboarding.scss';

const NewSettingsOnboarding = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const { vendors } = useVendors(undefined);
  const { userPlatformData } = usePlatform();
  const { user } = useUserAuth();
  const getBranchData = (res: object) => {
    const arr = [];
    Object.keys(userPlatformData.platforms).forEach((plat: string) => {
      userPlatformData.platforms[plat].forEach((obj: any) => {
        obj.vendor_ids.forEach((id: string) => {
          vendors.vendorsArr.forEach((objV: any) => {
            if (objV.vendor_id === id) {
              arr.push({
                branch_name: { title: objV.data.vendor_name, address: '' },
                accounts: [obj.email],
                linked_platforms: [{ platform: plat, status: 'active' }],
                branch_status:
                  res[plat]?.[id].is_active === 'True' || res[plat]?.[id].is_active === true
                    ? 'active'
                    : 'suspended',
                id,
              });
            }
          });
        });
      });
    });
    return arr;
  };
  const [branchData, setBranchData] = useState([]);
  useEffect(() => {
    if (vendors.vendorsArr.length > 0) {
      (async () => {
        const res = await loadUser({
          access_token: user.accessToken,
          vendors: vendors.vendorsObj,
        });
        setBranchData(getBranchData(res.data));
      })();
    }
  }, [vendors]);
  const getAccounts = () => {
    const arr = [];
    Object.keys(userPlatformData.platforms).forEach((plat: string) => {
      userPlatformData.platforms[plat].forEach((obj: object) => {
        arr.push({ ...obj, platform: plat });
      });
    });
    return arr;
  };
  const [accounts, setAccounts] = useState(getAccounts() || []);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const [clickedBranch, setClickedBranch] = useState({});

  const openCloseModal = () => {
    setOpenedModal(!openedModal);
    const clearArr = ['manageBranch', 'completed', 'manageAccount'];
    if (clearArr.find((str) => str === connectAccount)) {
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
    clickedBranch,
    connectAccount,
    setConnectAccount,
    vendors,
  };
  return (
    <div>
      <OnboardingModal propsVariables={propsVariables} />
      <OnboardingStepper
        activeStep={activeStep}
        accounts={accounts}
        openCloseModal={openCloseModal}
      />
      <OnboardingMiddleContent
        branchData={branchData}
        openCloseModal={openCloseModal}
        accounts={accounts}
        setConnectAccount={setConnectAccount}
      />
      <OnboardingTable
        branchData={branchData}
        openCloseModal={openCloseModal}
        setClickedBranch={setClickedBranch}
        setConnectAccount={setConnectAccount}
      />
    </div>
  );
};

export default NewSettingsOnboarding;
