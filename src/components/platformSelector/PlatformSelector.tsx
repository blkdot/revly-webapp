import './PlatformSelector.scss';

import PlatformBoxSelector from '../platformBoxSelector/PlatformBoxSelector';

const PlatformSelector = (props: any) => {
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
      <p style={{ color: '#212B36', fontWeight: 700, fontSize: '18px' }}>
        Select the delivery platforms that you are using so that we can show you the power of Revly
      </p>
    );
  };

  return (
    <div className='onboarding-platform'>
      {renderText()}
      <div className='onboarding-platform__selector'>{renderItems()}</div>
    </div>
  );
};

export default PlatformSelector;
