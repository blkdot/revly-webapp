import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import OnboardingMiddleContent from 'components/settings/onboarding/OnboardingMiddleContent';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import OnboardingTable from 'components/settings/onboarding/OnboardingTable';
import { usePlatform } from 'contexts';
import { useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import './SettingOnboarding.scss';

const NewSettingsOnboarding = () => {
  const { userPlatformData } = usePlatform();
  const [, setVendors] = useAtom(vendorsAtom);
  const { vendors } = useVendors(undefined);
  const [loading, setLoading] = useState(true);
  const getAccounts = () => {
    const arr = [];

    Object.keys(userPlatformData.platforms).forEach((plat: string) => {
      userPlatformData.platforms[plat].forEach((obj: object) => {
        arr.push({ ...obj, platform: plat });
      });
    });

    return arr;
  };

  const [openedModal, setOpenedModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [branchDataUploading, setBranchDataUploading] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [branchDataFiltered, setBranchDataFiltered] = useState([]);
  const [connectAccount, setConnectAccount] = useState('account');
  const [connect, setConnect] = useState('');
  const [clickedBranch, setClickedBranch] = useState({});
  const [accounts, setAccounts] = useState([]);

  const getBranchData = () => {
    setLoading(true);
    const arr = [];
    sortedVendors(vendors.display).forEach((cName) => {
      Object.keys(vendors.display[cName]).forEach((vName) => {
        arr.push({ name: vName, data: vendors.display[cName][vName], chainName: cName, });
      });
    });

    const vendorsAccounts = (obj: any) =>
      Object.keys(obj.data.platforms).map((plat) => obj.data.platforms[plat].email);

    const vendorPlatform = (obj: any) =>
      Object.keys(obj.data.platforms).map((plat) => ({
        email: obj.data.platforms[plat].email,
        platform: plat,
        status: userPlatformData.platforms[plat].find(
          (objAcc) => objAcc.email === obj.data.platforms[plat].email
        )?.active
          ? 'active'
          : 'suspended',
      }));

    const vendorsStatus = (obj: any) => {
      if (
        Object.keys(obj.data.platforms).every(
          (plat) =>
            obj.data.platforms[plat].metadata.is_active !== 'True' &&
            obj.data.platforms[plat].metadata.is_active !== true
        )
      )
        return 'suspended';

      if (!obj.data.is_matched) return 'in process';

      return 'active';
    };
    setLoading(false);
    return arr.map((obj) => ({
      branch_name: obj.name,
      accounts: vendorsAccounts(obj),
      linked_platforms: vendorPlatform(obj),
      branch_status: vendorsStatus(obj),
      id: obj.data.platforms[Object.keys(obj.data.platforms)[0]].vendor_id,
      chain_name: obj.chainName,
    }));
  };

  useEffect(() => {
    setAccounts(getAccounts());
  }, [JSON.stringify(userPlatformData.platforms)]);

  useEffect(() => {
    setVendors(vendors);
    setBranchData(getBranchData());
    setBranchDataFiltered(getBranchData());
  }, [vendors, JSON.stringify(userPlatformData.platforms)]);

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
    setLoading,
    loading,
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
        openCloseModal={openCloseModal}
        accounts={accounts}
        setConnectAccount={setConnectAccount}
        setBranchDataFiltered={setBranchDataFiltered}
        branchData={branchData}
      />
      <OnboardingTable
        loading={loading}
        branchData={branchDataFiltered}
        openCloseModal={openCloseModal}
        setClickedBranch={setClickedBranch}
        setConnectAccount={setConnectAccount}
      />
    </div>
  );
};

export default NewSettingsOnboarding;
