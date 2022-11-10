import React from 'react';
import './Finance.scss';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Finance = ({
  metricsbeforePeriod,
  metricsafterPeriod,
  chainObj,
  setTable,
  table,
  restaurants,
  display,
  vendors,
}) => {
  const { date } = useDate();
  const { beforePeriod, titleDate } = date;
  const startDate = new Date(beforePeriod.startDate);
  const endDate = new Date(beforePeriod.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const getbeforePeriod = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(startDate).format('DD/MM')}`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate, 1).getDate()) {
        return `${format(startDate, 'LLL', { locale: enUS })}  -  ${getYear(startDate)}`;
      }

      return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
    }

    return `${titleDate}`;
  };
  const getChecked = () => {
    const checked = [];
    Object.keys(chainObj).forEach((chainName) => {
      checked.push(
        Object.keys(chainObj[chainName]).every((n) => chainObj[chainName][n].checked === true),
      );
    });
    return checked.every((bool) => bool === true);
  };
  const getChain = () => {
    const obj = {};
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((n) => {
        if (chainObj[chainName][n].checked) {
          obj[chainName] = {};
        }
      });
    });
    return Object.keys(obj);
  };
  const isDisplay = () => {
    if (!display) {
      return restaurants.length === vendors.length || restaurants.length === 0 ? (
        <p>All Points of sales</p>
      ) : (
        <p>
          {' '}
          {vendors.map((obj) =>
            restaurants.find((el) => obj.data.vendor_name === el)
              ? `${obj.data.vendor_name}, `
              : '',
          )}
        </p>
      );
    }
    return getChecked() ? <p>All Points of sales</p> : getChain().join(', ');
  };
  return (
    <div className="block">
      <TypographyKit variant="h4">
        <p>{getbeforePeriod()}</p>
        <span> results for </span>
        {isDisplay()}
      </TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {['revenue', 'n_orders', 'average_basket', 'profit'].map((info) => (
          <Widget
            table={table}
            setTable={setTable}
            key={info}
            title={info}
            metricsbeforePeriod={metricsbeforePeriod}
            metricsafterPeriod={metricsafterPeriod}
          />
        ))}
      </div>
    </div>
  );
};

export default Finance;
