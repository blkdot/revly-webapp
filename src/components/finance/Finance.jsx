import React, { useState } from 'react';
import "./Finance.scss";
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import { FinanceData, restaurantNames, TableFinanceData } from "../../data/fakeDataDashboard";
import useDate from '../../hooks/useDate';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Finance = () => {
  const [table, setTable] = useState("Revenue");
  const { titleDate, leftDate, restaurants } = useDate();
  const startLocal = leftDate.startDate.toLocaleDateString();
  const endLocal = leftDate.endDate.toLocaleDateString();
  const startGetDate = leftDate.startDate.getDate();
  const endGetDate = leftDate.endDate.getDate();
  return (
    <div className="block">
      <TypographyKit variant="h4">
        Results of this
        <span>
          {" "}
          {
            titleDate === "custom" ? startLocal === endLocal ? startLocal :
              startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
                format(leftDate.startDate, 'LLL', { locale: enUS }) + " - " + getYear(leftDate.startDate) :
                startLocal + " - " + endLocal : titleDate
          }
          {" "}
        </span>
        for {restaurants.length === restaurantNames.length || restaurants.length === 0 ?
          <span> all points of sales</span> : <span>{restaurants.join(", ")}</span>}
      </TypographyKit>
      <TypographyKit variant="h4">Finance</TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {
          FinanceData.map((finance) => <Widget table={table} setTable={setTable} key={finance.id} {...finance} />)
        }
      </div>
      <TypographyKit variant={"h5"}>
        <span>{table}</span> of this
        {" "}
        <span>
          {titleDate === "custom" ? startLocal === endLocal ? startLocal :
            startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
              format(leftDate.startDate, 'LLL', { locale: enUS }) + " - " + getYear(leftDate.startDate) :
              startLocal + " - " + endLocal : titleDate}
        </span>
      </TypographyKit>
      {
        TableFinanceData.map((info) => info.type === table ? <Table key={info.id}  {...info} /> : "")
      }
    </div>
  );
};

export default Finance;
