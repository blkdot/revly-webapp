import React, { useState } from 'react';
import "./Marketing.scss";
import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import useDate from '../../hooks/useDate';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Marketing = ({metricsLeft,metricsRight}) => {
  const [table, setTable] = useState("accrued_discounts");
  const { titleDate, leftDate } = useDate();
  const startLocal = leftDate.startDate.toLocaleDateString();
  const endLocal = leftDate.endDate.toLocaleDateString();
  const startGetDate = leftDate.startDate.getDate();
  const endGetDate = leftDate.endDate.getDate();

  return (
    <div className="block">
      <TypographyKit variant="h4">Marketing</TypographyKit>
      <div className="cardsWrapper">
        {
          ["accrued_discounts", "roi"].map((e) => <Widget table={table} setTable={setTable} key={e} title={e} metricsLeft={metricsLeft} metricsRight={metricsRight} />)
        }
      </div>
      <TypographyKit style={{textTransform: "capitalize"}} variant={"h5"}>
        <span>{
          table === "accrued_discounts" ?
            "marketing express" : table === "n_orders" ?
              "orders" : table === "average_basket" ? "avg.basket" : table
          }</span> of this
        {" "}
        <span>
          {titleDate === "custom" ? startLocal === endLocal ? startLocal + '`s' :
            startGetDate === 1 && endGetDate === endOfMonth(leftDate.startDate, 1).getDate() ?
              `${format(leftDate.startDate, 'LLL', { locale: enUS })}'s  -  ${getYear(leftDate.startDate)}` :
              "custom week`s" : titleDate + '`s'}
        </span>
      </TypographyKit>
      {
        ["accrued_discounts", "roi"].map((info, index) => info === table ? <Table key={index} title={info} metricsLeft={metricsLeft} metricsRight={metricsRight} /> : "")
      }
    </div>
  );
};

export default Marketing;
