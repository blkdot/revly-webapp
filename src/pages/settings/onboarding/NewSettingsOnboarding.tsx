import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import OnboardingMiddleContent from 'components/settings/onboarding/OnboardingMiddleContent';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import OnboardingTable from 'components/settings/onboarding/OnboardingTable';
import { usePlatform, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import './SettingOnboarding.scss';

const NewSettingsOnboarding = () => {
  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [, setVendors] = useAtom(vendorsAtom);
  const { vendors } = useVendors(undefined);
  const { userPlatformData } = usePlatform();
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

  const getBranchData = () => {
    const arr = [];

    sortedVendors(vendors.display).forEach((cName) => {
      Object.keys(vendors.display[cName]).forEach((vName) => {
        arr.push({ name: vName, data: vendors.display[cName][vName] });
      });
    });
    const vendorsAccounts = (obj: any) =>
      Object.keys(obj.data.platforms).map((plat) => obj.data.platforms[plat].email);

    const vendorPlatform = (obj: any) =>
      Object.keys(obj.data.platforms).map((plat) => ({
        platform: plat,
        status: accounts.find((objAcc) => objAcc.email === obj.data.platforms[plat].email).active
          ? 'active'
          : 'suspended',
      }));

    const vendorsStatus = (obj: any) => {
      if (
        Object.keys(obj.data.platforms).some(
          (plat) =>
            obj.data.platforms[plat].metadata.is_active === 'True' ||
            obj.data.platforms[plat].metadata.is_active === true
        )
      ) {
        if (obj.data.is_matched) {
          return 'active';
        }
        return 'in process';
      }
      return 'suspended';
    };
    return arr.map((obj) => ({
      branch_name: { title: obj.name, address: '' },
      accounts: vendorsAccounts(obj),
      linked_platforms: vendorPlatform(obj),
      branch_status: vendorsStatus(obj),
      id: obj.data.platforms[Object.keys(obj.data.platforms)[0]].vendor_id,
    }));
  };
  const [branchData, setBranchData] = useState([]);
  useEffect(() => {
    setVendors(vendors);
    setBranchData(getBranchData());
  }, [vendors]);

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
        vendors={vendors}
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
