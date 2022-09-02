import React, { useState } from 'react';

import "./Finance.scss";

import Widget from '../widget/Widget';
import Table from '../table/Table';
import TypographyKit from '../../kits/typography/TypographyKit';
import { FinanceData, TableFinanceData } from "../../data/fakeDataDashboard";

const Finance = () => {
  const [table, setTable] = useState("Revenue");

  return (
    <div className="block">
      <TypographyKit variant="h4">Finance</TypographyKit>
      <div className="cardsWrapper finance-wrapper">
        {
          FinanceData.map((finance) => <Widget table={table} setTable={setTable} key={finance.id} {...finance} />)
        }
      </div>
      {
        TableFinanceData.map((info) => info.type === table ? <Table key={info.id}  {...info} /> : "")
      }
    </div>
  );
};

export default Finance;
