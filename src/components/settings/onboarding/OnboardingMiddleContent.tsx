import { useState, FC } from 'react';
import { ButtonKit } from 'kits';
import OnboardingDropdown from './OnboardingDropdown';
import plus from '../../../assets/images/plus.png';
import SettingsIcon from '../../../assets/images/ic_settings.png';

const OnboardingMiddleContent: FC<{
  openCloseModal: any;
  accounts: any;
  setConnectAccount: any;
  vendors: any;
}> = ({ openCloseModal, accounts, setConnectAccount, vendors }) => {
  const filteredChains = () => {
    const arr = [];
    Object.keys(vendors.display).forEach((cName) => {
      if(Object.keys(vendors.display[cName]).every((vName) => vendors.display[cName][vName].is_matched)){
        arr.push(cName)
      }
    })
    return arr;
  }
  const [kitchen, setKitchen] = useState(filteredChains());
  return (
    <div className='settings-onboarding-middle_content'>
      <div>
        <p className='__title'>Your branches list</p>
        <span className='__subtitle'>
          Egestas vel augue nunc risus augue neque amet diam in. Proin.
        </span>
      </div>
      <div className='settings-onboarding-btn_wrapper'>
        {accounts.length > 0 ? (
          <OnboardingDropdown
            rows={filteredChains()}
            state={kitchen || filteredChains()}
            setState={setKitchen}
          />
        ) : (
          ''
        )}
        {accounts.length > 0 ? (
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
        ) : (
          ''
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