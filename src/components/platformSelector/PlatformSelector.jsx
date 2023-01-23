import React from 'react';

import './PlatformSelector.scss';

import PlatformBoxSelector from '../platformBoxSelector/PlatformBoxSelector';

const PlatformSelector = (props) => {
  const { items, onClickItem, state, platforms, noText, errors, success } = props;

  const getState = (n) => state[n] === true;

  const getErrors = (n) => state[n] === true && errors[n] === true && success[n] === false;

  const getSuccess = (n) => state[n] === true && success[n] === true;

  const renderItems = () =>
    items.map((item) => (
      <PlatformBoxSelector
        key={item.name}
        item={item}
        onClickItem={onClickItem}
        classActive={getState(item.name)}
        classError={getErrors(item.name)}
        classSuccess={getSuccess(item.name)}
        platforms={platforms}
      />
    ));

  const renderText = () => {
    if (noText) return null;

    return (
      <div className="onboarding-platform__title">
        <div className="title__main">
          Connect to your Delevery platform Account to unleash the the Power of Revly
        </div>
        <div className="title__sub">
          Select the platform you are using and enter your data to get access
        </div>
      </div>
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
