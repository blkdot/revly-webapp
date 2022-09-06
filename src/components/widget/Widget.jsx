import React from 'react';
import MovingIcon from '@mui/icons-material/Moving';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import './Widget.scss';

import PaperKit from '../../kits/paper/PaperKit';
import CardKit from '../../kits/card/CardKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import TypographyKit from '../../kits/typography/TypographyKit';

const Widget = ({ procent, title, setTable, table }) => (
  <CardKit
    className={'card_wrapper ' + (table === title ? 'active' : '')}
    onClick={() => setTable(title)}
  >
    <CardContentKit>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <TypographyKit variant='subtitle2' className='card-typography' component='div'>
            {title}
          </TypographyKit>
          <TypographyKit variant='h3' className='card-typography'>
            17
          </TypographyKit>
        </div>
        <div className='card-typography'>
          <MonetizationOnIcon sx={{ fontSize: '50px' }} />
        </div>
      </div>
      <div className='card_bottom'>
        <PaperKit className={'icon-paper ' + (procent >= 0 ? 'active-bg' : '')}>
          <MovingIcon className={procent >= 0 ? 'increased' : 'decreased'} />
        </PaperKit>
        <TypographyKit className={'card-procent ' + (procent >= 0 ? 'active' : '')} variant='body2'>
          {procent > 0 ? '+' + procent : procent}%
        </TypographyKit>
        <TypographyKit className='card-week' variant='body3'>
          than last week
        </TypographyKit>
      </div>
    </CardContentKit>
  </CardKit>
);

export default Widget;
