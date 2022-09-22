import React from 'react';

import { FcCheckmark } from 'react-icons/fc';

import './PlatformBoxSelector.scss';

const PlatformBoxSelector = (props) => {
  const { item, onClickItem, classActive, platforms, classError, classSuccess } = props;
  const { name, src } = item;

  const renderIcon = () => {
    if ((platforms && platforms[name].registered) || classSuccess)
      return <FcCheckmark className="onboarding-platform__selector-item__state-icon" />;

    return null;
  };

  const getClassState = () => {
    if (classSuccess) return '__success';

    if (classError) return '__error';

    if (classActive) return '__active';

    return '';
  };

  return (
    <div
      className={`onboarding-platform__selector-item ${getClassState()}`}
      onClick={() => onClickItem(name)}
      onKeyDown={() => onClickItem(name)}
      role="button"
      tabIndex="0">
      {renderIcon()}
      <img src={src} alt={name} width="100" />
    </div>
  );
};

export default PlatformBoxSelector;
