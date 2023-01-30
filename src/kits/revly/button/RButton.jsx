import React from 'react';

import './RButton.scss';

const RButton = (props) => {
  const { onclick, children, ...rest } = props;

  return (
    <div className="revly-btn">
      <button type="button" onClick={onclick} {...rest}>
        {children}
      </button>
    </div>
  );
};

export default RButton;
