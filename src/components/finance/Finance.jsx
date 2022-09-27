import React, { useState } from 'react';
import './Finance.scss';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Finance = ({ metricsLeft, metricsRight, vendors }) => {
  const [table, setTable] = useState('revenue');
  const { titleDate, leftDate, restaurants } = useDate();
  const startDate = parseISO(leftDate.startDate);
  const endDate = parseISO(leftDate.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const getLeftDate = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(leftDate.startDate).format('DD/MM')}'s`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate()) {
        return `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(
          leftDate.startDate,
        )}`;
      }

      return `${dayjs(leftDate.startDate).format('DD/MM')} - ${dayjs(leftDate.endDate).format(
        'DD/MM',
      )}'s`;
    }

    return `${titleDate}'s`;
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
        <span> {getLeftDate()} </span>
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
            metricsLeft={metricsLeft}
            metricsRight={metricsRight}
          />
        ))}
      </div>
      <TypographyKit variant="h5">
        <span>{getLeftDate()}</span> <span>{getTable()}</span>
      </TypographyKit>
      {['revenue', 'n_orders', 'average_basket', 'profit'].map((info) =>
        info === table ? (
          <Table key={info} title={info} metricsLeft={metricsLeft} metricsRight={metricsRight} />
        ) : (
          ''
        ),
      )}
    </div>
  );
};

export default Finance;
