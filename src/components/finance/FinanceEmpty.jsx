import React from 'react';

import './Finance.scss';
import dayjs from 'dayjs';
import { endOfMonth, format, getYear, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Widget from '../widget/WidgetEmpty';
import Table from '../table/TableEmpty';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const FinanceEmpty = ({ vendors }) => {
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
        return `${dayjs(startDate).format('DD/MM')}`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate, 1).getDate()) {
        return `${format(startDate, 'LLL', { locale: enUS })}  -  ${getYear(startDate)}`;
      }

      return `${dayjs(leftDate.startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
    }

    return `${titleDate}`;
  };
  return (
    <div className="block">
      <TypographyKit variant="h4">
        <span> {getLeftDate()} </span>
        results for
        {restaurants.length === vendors?.length || restaurants.length === 0 ? (
          <p>
            {' '}
            all <span> points of sales</span>
          </p>
        ) : (
          <span> {restaurants.join(', ')}</span>
        )}
      </TypographyKit>
      <TypographyKit variant="h4">Finance</TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {[1, 2, 3, 4].map((f) => (
          <Widget key={f} />
        ))}
      </div>
      <Table />
    </div>
  );
};

export default FinanceEmpty;
