import React from 'react';

import './PlatformSelector.scss';

const PlatformSelector = (props) => {
  const { items, onClickItem, state } = props;

  const getState = (n) => (state[n] === true ? '__active' : '');

  const renderItems = () =>
    items.map((item) => (
      <div
        key={item.name}
        className={`onboarding-platform__selector-item ${getState(item.name)}`}
        onClick={() => onClickItem(item.name)}
        onKeyDown={() => onClickItem(item.name)}
        role="button"
        tabIndex="0"
      >
        <img src={item.src} alt={item.name} width='100' />
      </div>
    ));

  return (
    <div className='onboarding-platform'>
      <p>
        Select the delivery platforms that you are using so that we can show you the power of Revly
      </p>
      <div className='onboarding-platform__selector'>{renderItems()}</div>
    </div>
  );
};
// <div className="onboarding-platform__selector-item">
//   <img src={imageDeliveroo} alt="deliveroo" width="100" style={{ objectFit: 'contain' }} />
// </div>
// <div className="onboarding-platform__selector-item __active">
//   <img src={imageTalabat} alt="talabat" width="100" style={{ objectFit: 'contain' }} />
// </div>

export default PlatformSelector;
