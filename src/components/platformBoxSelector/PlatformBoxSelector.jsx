import React from 'react';

import './PlatformBoxSelector.scss';

const PlatformBoxSelector = (props) => {
  const { item, onClickItem, classActive } = props;
  const { name, src } = item;

  return (
    <div
      className={`onboarding-platform__selector-item ${classActive ? '__active' : ''}`}
      onClick={() => onClickItem(name)}
      onKeyDown={() => onClickItem(name)}
      role="button"
      tabIndex="0"
    >
      <img src={src} alt={name} width='100' />
    </div>
  );
};

export default PlatformBoxSelector;
