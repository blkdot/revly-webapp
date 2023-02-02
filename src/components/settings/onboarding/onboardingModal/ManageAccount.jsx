import React from 'react';
import TrashIcon from '../../../../assets/images/ic_trash.png';
import SwitchKit from '../../../../kits/switch/SwitchKit';
import CloseIcon from '../../../../assets/images/ic_close.png';
import { platformList } from '../../../../data/platformList';

const ManageAccount = ({ propsVariables }) => {
  const { openCloseModal, accounts } = propsVariables;
  return (
    <div tabIndex={-1} role='presentation' onClick={(e) => e.stopPropagation()}>
      <img
        className='onboarding-close_icon modal'
        tabIndex={-1}
        role='presentation'
        src={CloseIcon}
        alt='close icon'
        onClick={openCloseModal}
      />
      {accounts.length > 0 ? (
        <div>
          <p className='__title'>Manage your connected accounts</p>
          <span className='__subtitle'>
            This allows you to enable, disable or delete your connected accounts , once an account
            is delated the brands and branches associated to it will be removed .
          </span>
        </div>
      ) : (
        ''
      )}
      <div className='onboarding-accounts_wrapper'>
        {accounts.map((obj) => (
          <div key={obj.email} className={`onboarding-account ${obj.connected ? 'connected' : ''}`}>
            <div>
              <span
                className='onboarding-account_platform-logo'
                style={{
                  '--color': platformList.find((objP) => objP.name === obj.platform).color,
                }}
              >
                <img
                  src={
                    platformList.find((objP) => objP.name === obj.platform).srcFaviconWhite ||
                    platformList.find((objP) => objP.name === obj.platform).srcFavicon
                  }
                  alt={obj.platform}
                />
              </span>
              <p>{obj.email}</p>
            </div>
            <div>
              <span className='onboarding-account_trash-icon'>
                <img src={TrashIcon} alt='trash' />
              </span>
              <div className='onboarding-account_switch'>
                <p>{obj.connected ? 'Connected' : 'Disconnected'}</p>
                <SwitchKit checked={obj.connected} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAccount;
