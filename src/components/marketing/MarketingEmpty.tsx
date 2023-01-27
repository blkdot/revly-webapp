import React from 'react';
import './Marketing.scss';
import Widget from '../widget/WidgetEmpty';

const MarketingEmpty = () => (
  <div className='block'>
    <div className='cardsWrapper marketing'>
      {[1, 2].map((f) => (
        <Widget key={f} />
      ))}
    </div>
  </div>
);

export default MarketingEmpty;
