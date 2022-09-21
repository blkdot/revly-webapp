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
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import dayjs from 'dayjs';

const Widget = ({ title, setTable, table, metricsLeft, metricsRight }) => {
  const { titleRightDate, rightDate } = useDate();
  const startLocal = rightDate.startDate.toLocaleDateString();
  const endLocal = rightDate.endDate.toLocaleDateString();
  const startGetDate = rightDate.startDate.getDate();
  const endGetDate = rightDate.endDate.getDate();
  const procent =  0
  return (
    <CardKit
      className={'card_wrapper ' + (table === title ? 'active' : '')}
      onClick={() => setTable(title)}
    >
      <CardContentKit>
        <TypographyKit component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <TypographyKit style={{ textTransform: "capitalize" }} variant='subtitle2' className='card-typography' component='div'>
              {title === "n_orders" ? "orders" : title === "average_basket" ? "Avg.basket" : title === "accrued_discounts" ? "marketing express" : title}
            </TypographyKit>
            <TypographyKit variant='h3' className='card-typography'>
              {metricsLeft[2] ? metricsLeft[2][1][title] ? metricsLeft[2][1][title] : "-" : 0}
            </TypographyKit>
          </div>
          <TypographyKit className='card-typography card-icon'>
            {
              title === "revenue" ? <PaymentsOutlinedIcon /> : title === "n_orders" ?
                <ShoppingBasketOutlinedIcon /> : title === "profit" ? <AccountBalanceWalletOutlinedIcon /> :
                  title === "average_basket" ? <ShoppingBagOutlinedIcon /> :
                    title === "Marketing Express" ? <RedeemOutlinedIcon /> :
                      <img src={RoiIcon} alt={title} />
            }
          </TypographyKit>
        </TypographyKit>
        <div className='card_bottom'>
          <PaperKit className={'icon-paper ' + (procent > 0 ? 'increased' : procent < 0 ? 'decreased' : '')}>
            {procent > 0 ? <MovingIcon className='increased' /> : procent < 0 ? <MovingIcon className='decreased' /> : <ArrowRightAltIcon/>}
            
          </PaperKit>
          <TypographyKit className={'card-procent ' + (procent > 0 ? 'increased' : procent < 0 ? 'decreased' : "")} variant='body2'>
            {procent > 0 ? '+' + procent : procent}%
          </TypographyKit>
          <TypographyKit className='card-week' variant='body3'>
            than {" "} {
            titleRightDate === "custom" ? startLocal === endLocal ? dayjs(rightDate.startDate).format("DD/MM") + "'s" :
              startGetDate === 1 && endGetDate === endOfMonth(rightDate.startDate, 1).getDate() ?
                `${format(rightDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(rightDate.startDate)}` :
                `${dayjs(rightDate.startDate).format("DD/MM")} - ${dayjs(rightDate.endDate).format("DD/MM")}'s` : titleRightDate + "'s"
          }
          </TypographyKit>
        </div>
      </CardContentKit>
    </CardKit>
  )
};

export default Widget;
