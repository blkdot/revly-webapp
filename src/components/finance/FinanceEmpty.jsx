import React from 'react';

import './Finance.scss';
import dayjs from 'dayjs';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Widget from '../widget/WidgetEmpty';
import Table from '../table/TableEmpty';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';

const FinanceEmpty = ({ vendors }) => {
  const { titleDate, leftDate, restaurants } = useDate();
  const startLocal = leftDate.startDate.toLocaleDateString();
  const endLocal = leftDate.endDate.toLocaleDateString();
  const startGetDate = leftDate.startDate.getDate();
  const endGetDate = leftDate.endDate.getDate();
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
