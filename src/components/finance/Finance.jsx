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
  loading,
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
  const getChain = () => {
    const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
    Object.keys(chainObjTemp).forEach((chainName) => {
      if (Object.keys(chainObjTemp[chainName]).length === 0) {
        delete chainObjTemp[chainName];
      }
    });
    return Object.keys(chainObjTemp);
  };
  const isDisplay = () => {
    if (Object.keys(display).length > 0) {
      return getChain().length === Object.keys(display).length ? (
        <p>All Points of sales</p>
      ) : (
        getChain().join(', ')
      );
    }
    return restaurants.length === vendors.length ? (
      <p>All Points of sales</p>
    ) : (
      <p> {restaurants.join(', ')}</p>
    );
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
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default Finance;
