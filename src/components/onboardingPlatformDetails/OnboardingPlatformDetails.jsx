import React from 'react';

import './OnboardingPlatformDetails.scss';

const OnboardingPlatformDetails = (props) => {
  const { src, name } = props;

  return (
    <div className='onboarding-platform__selector-item-details'>
      <img src={src} alt={name} width='40' />
      <div className='selector-item-details__texts'>
        <span className='texts-name'>{name}</span>
        <span className='texts-helper'>Select the platform you are using and.</span>
      </div>
    </div>
  );
};

export default OnboardingPlatformDetails;
