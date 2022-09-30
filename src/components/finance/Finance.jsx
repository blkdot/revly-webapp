import React, { useState } from 'react';
import './Finance.scss';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Finance = ({ metricsDateFrom, metricsCompareDateValue, vendors }) => {
  const [table, setTable] = useState('revenue');
  const { titleDate, dateFromContext, restaurants } = useDate();
  const startDate = new Date(dateFromContext.startDate);
  const endDate = new Date(dateFromContext.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const getdateFrom = () => {
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
  const getTable = () => {
    if (table === 'n_orders') {
      return 'orders';
    }
    if (table === 'average_basket') {
      return 'Avg.basket';
    }
    if (table === 'accrued_discounts') {
      return 'marketing express';
    }
    return table;
  };
  return (
    <div className="block">
      <TypographyKit variant="h4">
        <span>{getdateFrom()} </span>
        results for{' '}
        {restaurants.length === vendors.length || restaurants.length === 0 ? (
          <p>
            all <span> points of sales</span>
          </p>
        ) : (
          <span>{restaurants.join(', ')}</span>
        )}
      </TypographyKit>
      <TypographyKit variant="h4">Finance</TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {['revenue', 'n_orders', 'average_basket', 'profit'].map((info) => (
          <Widget
            table={table}
            setTable={setTable}
            key={info}
            title={info}
            metricsDateFrom={metricsDateFrom}
            metricsCompareDateValue={metricsCompareDateValue}
          />
        ))}
      </div>
      <TypographyKit variant="h5">
        <span>{getdateFrom()}</span>
        &apos;s
        <span> {getTable()}</span>
      </TypographyKit>
      {['revenue', 'n_orders', 'average_basket', 'profit'].map((info) =>
        info === table ? (
          <Table
            key={info}
            title={info}
            metricsDateFrom={metricsDateFrom}
            metricsCompareDateValue={metricsCompareDateValue}
          />
        ) : (
          ''
        ),
      )}
    </div>
  );
};

export default Finance;
