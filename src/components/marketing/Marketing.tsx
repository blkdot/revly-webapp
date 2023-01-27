import Widget from '../widget/Widget';
import './Marketing.scss';

const Marketing = ({ metricsbeforePeriod, metricsafterPeriod, setTable, table, loading }) => {
  const marketingLinks = ['accrued_discounts', 'roi'];
  return (
    <div className='block'>
      <div className='cardsWrapper marketing'>
        {marketingLinks.map((info) => (
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
};
export default Marketing;
