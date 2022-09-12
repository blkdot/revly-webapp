import React from 'react';

import './PlatformSelector.scss';

import PlatformBoxSelector from '../platformBoxSelector/PlatformBoxSelector';

const PlatformSelector = (props) => {
  const { items, onClickItem, state } = props;

  const getState = (n) => (state[n] === true);

  const renderItems = () => items.map((item) => <PlatformBoxSelector key={item.name} item={item} onClickItem={onClickItem} classActive={getState(item.name)} />);

  return (
    <div className='onboarding-platform'>
      <p>
        Select the delivery platforms that you are using so that we can show you the power of Revly
      </p>
      <div className='onboarding-platform__selector'>{renderItems()}</div>
    </div>
  );
};

export default PlatformSelector;
