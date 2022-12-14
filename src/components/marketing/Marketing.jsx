import React from 'react';
import './Marketing.scss';
import Widget from '../widget/Widget';

const Marketing = ({ metricsbeforePeriod, metricsafterPeriod, setTable, table, loading }) => (
  <div className="block">
    <div className="cardsWrapper marketing">
      {['accrued_discounts', 'roi'].map((info) => (
        <Widget
          table={table}
          setTable={setTable}
          key={info}
          title={info}
          metricsbeforePeriod={metricsbeforePeriod}
          metricsafterPeriod={metricsafterPeriod}
          loading={loading}
        />
      ))}
    </div>
  </div>
);
export default Marketing;
