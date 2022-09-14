import React from 'react';
import { pascalCase } from 'change-case';

import './PlatformSettingsBox.scss';

import SwitchKit from '../../kits/switch/SwitchKit';
import ButtonKit from '../../kits/button/ButtonKit';

const PlatformSettingsBox = (props) => {
  const { active, src, type, registered, onChangeSwitch, onClick } = props;

  const renderFooter = () => {
    if (!active || !registered) return null;

    return (
      <div className="__footer-action">
        <ButtonKit onClick={onClick}>Change Credentials</ButtonKit>
      </div>
    );
  };

  return (
    <div className="platform-settings-box">
      <div className="platform-settings-box__content">
        <div className="__content__image">
          <img src={src} alt={type} />
        </div>
        <div className="__content__label">
          <span>Connect your {pascalCase(type)} account to your Revly account</span>
        </div>
        <div className="__content__switch">
          <SwitchKit checked={active} onChange={({ target }) => onChangeSwitch(target.checked)} />
        </div>
      </div>
      <div className="platform-settings-box__footer">{renderFooter()}</div>
    </div>
  );
};

export default PlatformSettingsBox;
