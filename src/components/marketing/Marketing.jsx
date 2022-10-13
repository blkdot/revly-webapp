import React, { useState } from 'react';
import './Marketing.scss';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Marketing = ({ metricsDateFrom, metricsCompareDateValue }) => {
  const [table, setTable] = useState('accrued_discounts');
  const { titleDate, dateFromContext } = useDate();
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
      return 'discount offered';
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
      {['accrued_discounts', 'roi'].map((info) =>
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

export default Marketing;
