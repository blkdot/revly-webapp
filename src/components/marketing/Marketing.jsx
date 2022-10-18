import React, { useState } from 'react';
import './Marketing.scss';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const Marketing = ({ metricsbeforePeriod, metricsafterPeriod }) => {
  const [table, setTable] = useState('accrued_discounts');
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
            metricsbeforePeriod={metricsbeforePeriod}
            metricsafterPeriod={metricsafterPeriod}
          />
        ))}
      </div>
      <TypographyKit variant="h5">
        <span>{getbeforePeriod()}</span>
        &apos;s
        <span> {getTable()}</span>
      </TypographyKit>
      {['accrued_discounts', 'roi'].map((info) =>
        info === table ? (
          <Table
            key={info}
            title={info}
            metricsbeforePeriod={metricsbeforePeriod}
            metricsafterPeriod={metricsafterPeriod}
          />
        ) : (
          ''
        ),
      )}
    </div>
  );
};

export default Marketing;
