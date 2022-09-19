import React from 'react';
import MovingIcon from '@mui/icons-material/Moving';

import './Widget.scss';

import PaperKit from '../../kits/paper/PaperKit';
import CardKit from '../../kits/card/CardKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import RoiIcon from "../../assets/images/roi.png"
import useDate from '../../hooks/useDate';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Widget = ({ procent, title, setTable, table, coin }) => {
  const { titleRightDate, rightDate } = useDate();
  const startLocal = rightDate.startDate.toLocaleDateString();
  const endLocal = rightDate.endDate.toLocaleDateString();
  const startGetDate = rightDate.startDate.getDate();
  const endGetDate = rightDate.endDate.getDate();
  return (
    <CardKit
      className={'card_wrapper ' + (table === title ? 'active' : '')}
      onClick={() => setTable(title)}
    >
      <CardContentKit>
        <TypographyKit component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <TypographyKit variant='subtitle2' className='card-typography' component='div'>
              {title}
            </TypographyKit>
            <TypographyKit variant='h3' className='card-typography'>
              {coin}
            </TypographyKit>
          </div>
          <TypographyKit className='card-typography card-icon'>
            {
              title === "Revenue" ? <PaymentsOutlinedIcon /> : title === "Orders" ?
                <ShoppingBasketOutlinedIcon /> : title === "Profit" ? <AccountBalanceWalletOutlinedIcon /> :
                  title === "Avg.Basket" ? <ShoppingBagOutlinedIcon /> :
                    title === "Marketing Express" ? <RedeemOutlinedIcon /> :
                      <img src={RoiIcon} alt={title} />
            }
          </TypographyKit>
        </TypographyKit>
        <div className='card_bottom'>
          <PaperKit className={'icon-paper ' + (procent >= 0 ? 'active-bg' : '')}>
            <MovingIcon className={procent >= 0 ? 'increased' : 'decreased'} />
          </PaperKit>
          <TypographyKit className={'card-procent ' + (procent >= 0 ? 'active' : '')} variant='body2'>
            {procent > 0 ? '+' + procent : procent}%
          </TypographyKit>
          <TypographyKit className='card-week' variant='body3'>
            than {" "} {titleRightDate === "custom" ? startLocal === endLocal ? startLocal :
              startGetDate === 1 && endGetDate === endOfMonth(rightDate.startDate, 1).getDate() ?
                format(rightDate.startDate, 'LLL', { locale: enUS }) + " - " + getYear(rightDate.startDate) :
                startLocal + " - " + endLocal : titleRightDate}
          </TypographyKit>
        </div>
      </CardContentKit>
    </CardKit>
  )
};

export default Widget;
