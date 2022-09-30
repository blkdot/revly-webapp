import React from 'react';
import MovingIcon from '@mui/icons-material/Moving';

import './Widget.scss';

import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import dayjs from 'dayjs';
import useDate from '../../hooks/useDate';
import RoiIcon from '../../assets/images/roi.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import CardContentKit from '../../kits/cardContent/CardContentKit';
import CardKit from '../../kits/card/CardKit';
import PaperKit from '../../kits/paper/PaperKit';

const Widget = ({ title, setTable, table, metricsDateFrom, metricsCompareDateValue }) => {
  const { titlecompareDateValue, compareDateValueContext: compareDateValue } = useDate();
  const startDate = parseISO(compareDateValue.startDate);
  const endDate = parseISO(compareDateValue.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const procent = () => {
    if (metricsDateFrom[0] && metricsCompareDateValue[0]) {
      if (Number(metricsCompareDateValue[0][1][title]) === 0) {
        return 0;
      }

      return Number(
        (metricsDateFrom[0][1][title] / (metricsCompareDateValue[0][1][title] / 100) - 100).toFixed(
          2,
        ),
      );
    }
    return '-';
  };
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
  const getcompareDateValue = () => {
    if (titlecompareDateValue === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(compareDateValue.startDate).format('DD/MM')}`;
      }
      if (
        startGetDate === 1 &&
        endGetDate === endOfMonth(parseISO(compareDateValue.startDate), 1).getDate()
      ) {
        return `${format(parseISO(compareDateValue.startDate), 'LLL', {
          locale: enUS,
        })}  -  ${getYear(parseISO(compareDateValue.startDate))}`;
      }

      return `${dayjs(compareDateValue.startDate).format('DD/MM')} - ${dayjs(
        compareDateValue.endDate,
      ).format('DD/MM')}`;
    }

    return `${titlecompareDateValue}`;
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
              {metricsDateFrom[0][1][title] !== null ? metricsDateFrom[0][1][title] : '-'}
            </TypographyKit>
          </div>
          <TypographyKit className="card-typography card-icon">{getIcon()}</TypographyKit>
        </TypographyKit>
        <div className="card_bottom">
          <PaperKit
            className={`icon-paper ${procent() > 0 ? 'increased' : ''} ${
              procent() < 0 ? 'decreased' : ''
            }`}>
            {procent() === 0 ? (
              <ArrowRightAltIcon />
            ) : (
              <MovingIcon className={procent() > 0 ? 'increased' : 'decreased'} />
            )}
          </PaperKit>
          <TypographyKit
            className={`card-procent ${procent() > 0 ? 'increased' : ''} ${
              procent() < 0 ? 'decreased' : ''
            }`}
            variant="body2">
            {procent() > 0 ? `+${procent()}%` : `${procent()}%`}
          </TypographyKit>
          <TypographyKit className="card-week" variant="body3">
            than {getcompareDateValue()}
          </TypographyKit>
        </div>
      </CardContentKit>
    </CardKit>
  );
};

export default Widget;
