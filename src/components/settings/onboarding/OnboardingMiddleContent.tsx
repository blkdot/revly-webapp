import { useState, FC, useEffect } from 'react';
import { ButtonKit } from 'kits';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import OnboardingDropdown from './OnboardingDropdown';
import plus from '../../../assets/images/plus.png';
import SettingsIcon from '../../../assets/images/ic_settings.png';

const OnboardingMiddleContent: FC<{
  openCloseModal: any;
  accounts: any;
  setConnectAccount: any;
}> = ({ openCloseModal, accounts, setConnectAccount }) => {
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
  }, [filteredChains().length]);
  return (
    <div className='settings-onboarding-middle_content'>
      <div>
        <p className='dashboard-title'>Your branches list</p>
        <span className='dashboard-subtitle'>
          Add and manage all your chains and branches. Monitor the activity of your branches.
        </span>
      </div>
      <div className='settings-onboarding-btn_wrapper'>
        {accounts.length > 0 && (
          <OnboardingDropdown rows={filteredChains()} state={kitchen} setState={setKitchen} />
        )}
        {accounts.length > 0 && (
          <ButtonKit
            onClick={() => {
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
          onClick={(e) => openCloseModal(e)}
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
