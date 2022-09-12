import React, { useState } from 'react';

import './Marketing.scss';

import TypographyKit from '../../kits/typography/TypographyKit';
import Widget from '../widget/Widget';
import Table from '../table/Table';

function MarketingEmpty() {
  const [table, setTable] = useState('Marketing Express');

  return (
    <div className='block'>
      <TypographyKit variant='h4'>Marketing</TypographyKit>
      <div className='cardsWrapper'>
        {[].map((finance) => (
          <Widget table={table} setTable={setTable} key={finance.id} {...finance} />
        ))}
      </div>
      {[].map((info) =>
        info.type === table ? <Table key={info.id} {...info} /> : ''
      )}
    </div>
  );
}

export default MarketingEmpty;
