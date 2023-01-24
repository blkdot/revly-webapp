import React from 'react';

import './PlatformSelector.scss';

import PlatformBoxSelector from '../platformBoxSelector/PlatformBoxSelector';

const PlatformSelector = (props) => {
  const { items, onClickItem, data } = props;

  const isConnected = (n) => data.platforms[n].registered;

  const renderItems = () =>
    items.map((item) => (
      <PlatformBoxSelector
        key={item.name}
        onClickItem={onClickItem}
        classSuccess={isConnected(item.name)}
        item={item}
      />
    ));

  return (
    <div className="onboarding-platform">
      <div className="onboarding-platform__selector">{renderItems()}</div>
    </div>
  );
};

export default PlatformSelector;
