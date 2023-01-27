import React from 'react';

import './Finance.scss';
import Widget from '../widget/WidgetEmpty';
import TypographyKit from '../../kits/typography/TypographyKit';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';

const FinanceEmpty = () => (
  <div className='block'>
    <TypographyKit variant='h4'>
      <SkeletonKit height={50} width={500} />
    </TypographyKit>
    <div className='cardsWrapper finance-wrapper'>
      {[1, 2, 3, 4].map((f) => (
        <Widget key={f} />
      ))}
    </div>
  </div>
);

export default FinanceEmpty;
