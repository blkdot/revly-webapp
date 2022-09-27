import React from 'react';
import MovingIcon from '@mui/icons-material/Moving';

import './Widget.scss';

import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import dayjs from 'dayjs';
import useDate from '../../hooks/useDate';
import RoiIcon from '../../assets/images/roi.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import CardKit from '../../kits/card/CardKit';
import PaperKit from '../../kits/paper/PaperKit';

const Widget = ({ title, setTable, table, metricsLeft, metricsRight }) => {
  const { titleRightDate, rightDate } = useDate();
  const startDate = new Date(rightDate.startDate);
  const endDate = new Date(rightDate.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const procent =
    metricsLeft[2] && metricsRight[2]
      ? Number((metricsLeft[2][1][title] / (metricsRight[2][1][title] / 100) - 100).toFixed(2))
      : 0;
  const getTitle = () => {
    if (title === 'n_orders') {
      return 'orders';
    }
    if (title === 'average_basket') {
      return 'Avg.basket';
    }
    if (title === 'accrued_discounts') {
      return 'marketing express';
    }
    return title;
  };
  const getRightDate = () => {
    if (titleRightDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(rightDate.startDate).format('DD/MM')}'s`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(rightDate.startDate, 1).getDate()) {
        return `${format(rightDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(
          rightDate.startDate,
        )}`;
      }

      return `${dayjs(rightDate.startDate).format('DD/MM')} - ${dayjs(rightDate.endDate).format(
        'DD/MM',
      )}'s`;
    }

    return `${titleRightDate}'s`;
  };
  const getIcon = () => {
    if (title === 'reveunue') {
      return <PaymentsOutlinedIcon />;
    }
    if (title === 'n_orders') {
      return <ShoppingBasketOutlinedIcon />;
    }
    if (title === 'profit') {
      return <AccountBalanceWalletOutlinedIcon />;
    }
    if (title === 'average_basket') {
      return <ShoppingBagOutlinedIcon />;
    }
    if (title === 'accrued_discounts') {
      return <RedeemOutlinedIcon />;
    }
    return <img src={RoiIcon} alt={title} />;
  };
  return (
    <CardKit
      className={`card_wrapper ${table === title ? 'active' : ''}`}
      onClick={() => setTable(title)}>
      <CardContentKit>
        <TypographyKit
          component="div"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <TypographyKit
              style={{ textTransform: 'capitalize' }}
              variant="subtitle2"
              className="card-typography"
              component="div">
              {getTitle()}
            </TypographyKit>
            <TypographyKit variant="h3" className="card-typography">
              {metricsLeft[2][1][title] !== null ? metricsLeft[2][1][title] : '-'}
            </TypographyKit>
          </div>
          <TypographyKit className="card-typography card-icon">{getIcon()}</TypographyKit>
        </TypographyKit>
        <div className="card_bottom">
          <PaperKit
            className={`icon-paper ${procent > 0 ? 'increased' : ''} ${
              procent < 0 ? 'decreased' : ''
            }`}>
            {procent === 0 ? (
              <ArrowRightAltIcon />
            ) : (
              <MovingIcon className={procent > 0 ? 'increased' : 'decreased'} />
            )}
          </PaperKit>
          <TypographyKit
            className={`card-procent ${procent > 0 ? 'increased' : ''} ${
              procent < 0 ? 'decreased' : ''
            }`}
            variant="body2">
            {procent > 0 ? `+${procent}` : procent}%
          </TypographyKit>
          <TypographyKit className="card-week" variant="body3">
            than {getRightDate()}
          </TypographyKit>
        </div>
      </CardContentKit>
    </CardKit>
  );
};

export default Widget;
