import React from 'react';
import BoxKit from '../../kits/box/BoxKit';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';

const MarketingRadio = ({ title, subtitle, icon, className, disabled }) => (
  <BoxKit className={`left-part-radio ${disabled ? 'disabled' : ''} ${!icon ? 'reversed' : ''}`}>
    <div>
      {icon ? (
        <span className={className}>
          <img src={icon} alt="Box Icon" />
        </span>
      ) : (
        ''
      )}
      <div>
        {title}
        {subtitle ? <p>{subtitle}</p> : ''}
      </div>
    </div>
    {!disabled ? <FormControlLabelKit value={title} control={<RadioKit />} /> : ''}
  </BoxKit>
);

export default MarketingRadio;
