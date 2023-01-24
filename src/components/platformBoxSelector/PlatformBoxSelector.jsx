/* eslint-disable no-unused-vars */
import React from 'react';

import RButton from '../../kits/revly/button/RButton';
import OnboardingPlatformDetails from '../onboardingPlatformDetails/OnboardingPlatformDetails';

import './PlatformBoxSelector.scss';

const PlatformBoxSelector = (props) => {
  const { item, onClickItem, classSuccess } = props;
  const { name, src } = item;

  const renderedButton = () => {
    if (!classSuccess) return <RButton onClick={() => onClickItem(name)}>Connect</RButton>;

    return <div className="selector-item__success">Connected</div>;
  };

  return (
    <div className="onboarding-platform__selector-item">
      <OnboardingPlatformDetails src={src} name={name} />
      <div>{renderedButton()}</div>
    </div>
  );
};

export default PlatformBoxSelector;
