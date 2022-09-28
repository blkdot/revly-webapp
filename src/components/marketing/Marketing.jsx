import React, { useState } from 'react';
import './Marketing.scss';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Marketing = ({ metricsLeft, metricsRight }) => {
  const [table, setTable] = useState('accrued_discounts');
  const { titleDate, leftDate } = useDate();
  const startDate = parseISO(leftDate.startDate);
  const endDate = parseISO(leftDate.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const getLeftDate = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(leftDate.startDate).format('DD/MM')}`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate()) {
        return `${format(leftDate.startDate, 'LLL', { locale: enUS })}  -  ${getYear(
          leftDate.startDate,
        )}`;
      }

      return `${dayjs(leftDate.startDate).format('DD/MM')} - ${dayjs(leftDate.endDate).format(
        'DD/MM',
      )}`;
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
      <TypographyKit variant="h4">Marketing</TypographyKit>
      <div className="cardsWrapper">
        {['accrued_discounts', 'roi'].map((info) => (
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
      <TypographyKit style={{ textTransform: 'capitalize' }} variant="h5">
        <span>{getLeftDate()}</span>
        <span>&apos;s</span>
        <span> {getTable()}</span>
      </TypographyKit>
      {['accrued_discounts', 'roi'].map((info) =>
        info === table ? (
          <Table key={info} title={info} metricsLeft={metricsLeft} metricsRight={metricsRight} />
        ) : (
          ''
        ),
      )}
    </div>
  );
};

export default Marketing;
