import React from 'react';

import './PlatformSelector.scss';

import PlatformBoxSelector from '../platformBoxSelector/PlatformBoxSelector';

const PlatformSelector = (props) => {
  const { items, onClickItem, state, platforms, noText, errors } = props;

  const getState = (n) => state[n] === true;

  const getErrors = (n) => state[n] === true && errors[n] === true;

  const renderItems = () =>
    items.map((item) => (
      <PlatformBoxSelector
        key={item.name}
        item={item}
        onClickItem={onClickItem}
        classActive={getState(item.name)}
        classError={getErrors(item.name)}
        platforms={platforms}
      />
    ));

  const renderText = () => {
    if (noText) return null;

    return (
      <p>
        Select the delivery platforms that you are using so that we can show you the power of Revly
      </p>
    );
  };

  return (
    <div className="onboarding-platform">
      {renderText()}
      <div className="onboarding-platform__selector">{renderItems()}</div>
    </div>
  );
};

export default PlatformSelector;
