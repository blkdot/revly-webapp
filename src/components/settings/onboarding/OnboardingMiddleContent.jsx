import React, { useState } from 'react';
import plus from '../../../assets/images/plus.png';
import SettingsIcon from '../../../assets/images/ic_settings.png';
import OnboardingDropdown from './OnboardingDropdown';
import ButtonKit from '../../../kits/button/ButtonKit';

const OnboardingMiddleContent = ({ branchData, openCloseModal, accounts }) => {
  const [kitchen, setKitchen] = useState('');

  return (
    <div className="settings-onboarding-middle_content">
      <div>
        <p className="__title">Your branches list</p>
        <span className="__subtitle">
          Egestas vel augue nunc risus augue neque amet diam in. Proin.
        </span>
      </div>
      <div className="settings-onboarding-btn_wrapper">
        {accounts.length > 0 ? (
          <OnboardingDropdown
            rows={branchData
              .filter((obj) => obj.branch_status !== 'in process')
              .map((obj) => obj.branch_name.title)}
            state={kitchen || branchData[0]?.branch_name?.title || ''}
            setState={setKitchen}
          />
        ) : (
          ''
        )}
        {accounts.length > 0 ? (
          <ButtonKit className="settings-onboarding-btn white" variant="contained">
            <img src={SettingsIcon} alt="settings-icon" />
            Manage my Accounts
          </ButtonKit>
        ) : (
          ''
        )}
        <ButtonKit onClick={openCloseModal} className="settings-onboarding-btn" variant="contained">
          <img src={plus} alt="plus" />
          add new account
        </ButtonKit>
      </div>
    </div>
  );
};

export default OnboardingMiddleContent;
