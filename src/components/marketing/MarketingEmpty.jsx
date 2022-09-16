import React from 'react';

import './Marketing.scss';

import TypographyKit from '../../kits/typography/TypographyKit';
import Table from '../table/TableEmpty';
import Widget from '../widget/WidgetEmpty';

const MarketingEmpty = () => (
  <div className="block">
    <TypographyKit variant="h4">Marketing</TypographyKit>
    <div className="cardsWrapper finance-wrapper">
      {[1, 2, 3].map((f) => (
        <Widget key={f} />
      ))}
    </div>
    <Table />
  </div>
);

export default MarketingEmpty;
