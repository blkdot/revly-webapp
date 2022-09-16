import React from 'react';

import './Finance.scss';
import Widget from '../widget/WidgetEmpty';
import Table from '../table/TableEmpty';
import TypographyKit from '../../kits/typography/TypographyKit';

const FinanceEmpty = () => (
  <div className="block">
    <TypographyKit variant="h4">Finance</TypographyKit>
    <div className="cardsWrapper finance-wrapper">
      {[1, 2, 3, 4].map((f) => (
        <Widget key={f} />
      ))}
    </div>
    <Table />
  </div>
);

export default FinanceEmpty;
