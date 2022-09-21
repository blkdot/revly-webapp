import React from 'react';

import { FcCheckmark } from 'react-icons/fc';

import './PlatformBoxSelector.scss';

const PlatformBoxSelector = (props) => {
  const { item, onClickItem, classActive, platforms } = props;
  const { name, src } = item;

  const renderIcon = () => {
    if (platforms && platforms[name].registered)
      return <FcCheckmark className="onboarding-platform__selector-item__state-icon" />;

    return null;
  };

  return (
    <div
      className={`onboarding-platform__selector-item ${classActive ? '__active' : ''}`}
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
