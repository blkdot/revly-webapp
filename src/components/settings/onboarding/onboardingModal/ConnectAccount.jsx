import React from 'react';
import Trash from '../../../../assets/icons/Trash';
import SwitchKit from '../../../../kits/switch/SwitchKit';
import ButtonKit from '../../../../kits/button/ButtonKit';
import CloseIcon from '../../../../assets/images/ic_close.png';
import { platformList } from '../../../../data/platformList';

const ConnectAccount = ({ propsVariables }) => {
  const { openCloseModal, accounts, setConnect } = propsVariables;
  return (
    <div tabIndex={-1} role="presentation" onClick={(e) => e.stopPropagation()}>
      <img
        className="onboarding-close_icon modal"
        tabIndex={-1}
        role="presentation"
        src={CloseIcon}
        alt="close icon"
        onClick={openCloseModal}
      />
      <p className="__title">Connect your Accounts</p>
      <span className="__subtitle">
        This allows for easy access to important information and ensures that all necessary data are
        uploaded and stored securely.
      </span>
      <div className={`onboarding-platform-buttons ${accounts.length <= 0 ? 'active' : ''}`}>
        {platformList.map((obj) => (
          <ButtonKit
            onClick={() => setConnect(obj.name)}
            variant="contained"
            key={obj.name}
            style={{ '--color': obj.color }}
          >
            <img src={obj.srcFaviconWhite || obj.srcFavicon} alt={obj.name} />
            Connect with {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
          </ButtonKit>
        ))}
      </div>
      {accounts.length > 0 ? (
        <div>
          <p className="__title">Manage your connected accounts</p>
          <span className="__subtitle">
            This allows you to enable, disable or delete your connected accounts , once an account
            is delated the brands and branches associated to it will be removed .
          </span>
        </div>
      ) : (
        ''
      )}
      <div className="onboarding-accounts_wrapper">
        {accounts.map((obj) => (
          <div key={obj.email} className={`onboarding-account ${obj.connected ? 'connected' : ''}`}>
            <div>
              <span
                className="onboarding-account_platform-logo"
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
              <span className="onboarding-account_trash-icon">
                <Trash />
              </span>
              <div className="onboarding-account_switch">
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

export default ConnectAccount;
