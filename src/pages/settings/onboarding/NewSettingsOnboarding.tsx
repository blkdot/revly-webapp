import { settingsOnboard } from 'api';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import OnboardingMiddleContent from 'components/settings/onboarding/OnboardingMiddleContent';
import OnboardingModal from 'components/settings/onboarding/OnboardingModal';
import OnboardingStepper from 'components/settings/onboarding/OnboardingStepper';
import OnboardingTable from 'components/settings/onboarding/OnboardingTable';
import { usePlatform, useUser } from 'contexts';
import { useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ContainerKit } from 'kits';
import { useEffect } from 'react';
import {
  onboardingAccountsAtom,
  onboardingBranchDataAtom,
  onboardingBranchDataFilteredAtom,
  onboardingConnectAccountAtom,
  onboardingLoadingAtom,
  onboardingOpenedModalAtom,
} from 'store/onboardingAtom';
import { vendorsAtom } from 'store/vendorsAtom';
import SettingsTopInputs from '../component/SettingsTopInputs';
import './SettingOnboarding.scss';

const NewSettingsOnboarding = () => {
  const { userPlatformData } = usePlatform();
  const [, setVendors] = useAtom(vendorsAtom);
  const { vendors } = useVendors();
  const [, setLoading] = useAtom(onboardingLoadingAtom);
  const [openedModal, setOpenedModal] = useAtom(onboardingOpenedModalAtom);
  const [, setBranchData] = useAtom(onboardingBranchDataAtom);
  const [, setBranchDataFiltered] = useAtom(onboardingBranchDataFilteredAtom);
  const [connectAccount, setConnectAccount] = useAtom(onboardingConnectAccountAtom);
  const [, setAccounts] = useAtom(onboardingAccountsAtom);

  const getAccounts = () => {
    const arr = [];

    Object.keys(userPlatformData.platforms).forEach((plat: string) => {
      userPlatformData.platforms[plat].forEach((obj: any) => {
        if (obj.email && obj.vendor_ids.length > 0) {
          arr.push({ ...obj, platform: plat });
        }
      });
    });

    return arr;
  };
  const getBranchData = () => {
    setLoading(true);
    const arr = [];
    sortedVendors(vendors.display).forEach((cName) => {
      Object.keys(vendors.display[cName]).forEach((vName) => {
        arr.push({ name: vName, data: vendors.display[cName][vName], chainName: cName });
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
            obj.data.platforms[plat].metadata.is_active === 'False' ||
            obj.data.platforms[plat].metadata.is_active === false
        )
      )
        return 'suspended';

      if (!obj.data.is_matched) return 'in process';

      return 'active';
    };
    setLoading(false);
    return arr.map((obj) => ({
      branch_name: obj.name.split('_')[0],
      accounts: vendorsAccounts(obj),
      linked_platforms: vendorPlatform(obj),
      branch_status: vendorsStatus(obj),
      id: obj.data.platforms[Object.keys(obj.data.platforms)[0]].vendor_id,
      ids: Object.keys(obj.data.platforms).map((plat) => obj.data.platforms[plat].vendor_id),
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
  const user = useUser();
  const openCloseModal = async () => {
    setOpenedModal(!openedModal);
    const clearArr = ['manageBranch', 'completed', 'manageAccount'];

    if (connectAccount === 'completed') {
      await settingsOnboard({
        master_email: user.email,
      });
    }
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

  return (
    <div className='wrapper'>
      <SettingsTopInputs />
      <ContainerKit>
        <OnboardingModal openCloseModal={openCloseModal} />
        <OnboardingStepper openCloseModal={openCloseModal} />
        <OnboardingMiddleContent openCloseModal={openCloseModal} />
        <OnboardingTable openCloseModal={openCloseModal} />
      </ContainerKit>
    </div>
  );
};

export default NewSettingsOnboarding;
