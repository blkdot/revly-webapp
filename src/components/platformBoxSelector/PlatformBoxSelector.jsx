/* eslint-disable no-unused-vars */
import React from 'react';

import RButton from '../../kits/revly/button/RButton';

import './PlatformBoxSelector.scss';

const PlatformBoxSelector = (props) => {
  const { item, onClickItem, classActive, platforms, classError, classSuccess } = props;
  const { name, src } = item;

  return (
    <div className="onboarding-platform__selector-item">
      <div className="onboarding-platform__selector-item-details">
        <img src={src} alt={name} width="40" />
        <div className="selector-item-details__texts">
          <span className="texts-name">{name}</span>
          <span className="texts-helper">Select the platform you are using and.</span>
        </div>
      </div>
      <div>
        <RButton onClick={() => onClickItem(name)}>Connect</RButton>
      </div>
    </div>
  );
};

export default PlatformBoxSelector;
