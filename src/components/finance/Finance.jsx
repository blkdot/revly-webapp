import React, { useState } from 'react';
import "./Finance.scss";
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import { restaurantNames } from "../../data/fakeDataDashboard";
import useDate from '../../hooks/useDate';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Finance = ({metricsLeft,metricsRight}) => {
  const [table, setTable] = useState("revenue");
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
            titleDate === "custom" ? startLocal === endLocal ? startLocal + '`s' :
              startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
                `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(leftDate.startDate)}` :
                "custom week`s" : titleDate + '`s'
          }
          {" "}
        </span>
        for all {restaurants.length === restaurantNames.length || restaurants.length === 0 ?
          <span> points of sales</span> : <span>{restaurants.join(", ")}</span>}
      </TypographyKit>
      <TypographyKit variant="h4">Finance</TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {
          ["revenue", "n_orders", "average_basket", "profit"].map((e) => <Widget table={table} setTable={setTable} key={e} title={e} metricsLeft={metricsLeft} metricsRight={metricsRight} />)
        }
      </div>
      <TypographyKit style={{ textTransform: "capitalize" }} variant={"h5"}>
        <span>
          {
            table === "accrued_discounts" ?
              "marketing express" : table === "n_orders" ?
                "orders" : table === "average_basket" ? "avg.basket" : table
          }
        </span> of this
        {" "}
        <span>
          {titleDate === "custom" ? startLocal === endLocal ? startLocal + '`s' :
            startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
              `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(leftDate.startDate)}` :
              "custom week`s" : titleDate + '`s'}
        </span>
      </TypographyKit>
      {
        ["revenue", "n_orders", "average_basket", "profit"].map((info, index) => info === table ? <Table key={index} title={info} metricsLeft={metricsLeft} metricsRight={metricsRight} /> : "")
      }
    </div>
  );
};

export default Finance;
