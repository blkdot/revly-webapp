import { PageHeader } from 'components';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC, useEffect, useState } from 'react';
import {
  onboardingAccountsAtom,
  onboardingBranchDataAtom,
  onboardingBranchDataFilteredAtom,
  onboardingConnectAccountAtom,
} from 'store/onboardingAtom';
import { vendorsAtom } from 'store/vendorsAtom';
import SettingsIcon from '../../../assets/linkIcons/settings.svg';
import plus from '../../../assets/images/plus.png';
import OnboardingDropdown from './OnboardingDropdown';

const OnboardingMiddleContent: FC<{
  openCloseModal: () => void;
}> = ({ openCloseModal }) => {
  const [accounts] = useAtom(onboardingAccountsAtom);
  const [, setConnectAccount] = useAtom(onboardingConnectAccountAtom);
  const [, setBranchDataFiltered] = useAtom(onboardingBranchDataFilteredAtom);
  const [branchData] = useAtom(onboardingBranchDataAtom);
  const [vendors] = useAtom(vendorsAtom);
  const filteredChains = () => {
    const arr = [];
    Object.keys(vendors.display).forEach((cName) => {
      if (
        Object.keys(vendors.display[cName]).every(
          (vName) => vendors.display[cName][vName].is_matched
        )
      ) {
        arr.push(cName);
      }
    });
    return arr;
  };
  const [kitchen, setKitchen] = useState([]);
  useEffect(() => {
    setKitchen(filteredChains());
  }, [filteredChains().length, branchData]);
  return (
    <div className='settings-onboarding-middle_content'>
      <PageHeader
        title='Your branches list'
        description='Add and manage all your chains and branches. Monitor the activity of your branches'
      />
      <div className='settings-onboarding-btn_wrapper'>
        {accounts.length > 0 && (
          <OnboardingDropdown
            rows={filteredChains()}
            state={kitchen}
            handleChange={({ target }) => {
              setBranchDataFiltered(
                branchData.filter((obj) => target.value.includes(obj.chain_name))
              );
              setKitchen(target.value);
            }}
          />
        )}
        {accounts.length > 0 && (
          <ButtonKit
            onClick={(e) => {
              openCloseModal();
              setConnectAccount('manageAccount');
            }}
            className='settings-onboarding-btn white'
            variant='contained'
          >
            <img src={SettingsIcon} alt='settings-icon' />
            Manage my Accounts
          </ButtonKit>
        )}
        <ButtonKit
          onClick={() => openCloseModal()}
          className='settings-onboarding-btn'
          variant='contained'
        >
          <img src={plus} alt='plus' />
          add new account
        </ButtonKit>
      </div>
    </div>
  );
};

export default OnboardingMiddleContent;
