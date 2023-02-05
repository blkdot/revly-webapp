import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useDate } from 'hooks';
import { TypographyKit } from 'kits';
import Widget from '../widget/Widget';
import './Finance.scss';

const Finance = ({
  metricsbeforePeriod,
  metricsafterPeriod,
  chainObj,
  setTable,
  table,
  vendorsSelected,
  display,
  vendors,
  loading,
}) => {
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
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        return `${format(startDate, 'LLL', { locale: enUS })}  -  ${getYear(startDate)}`;
      }

      return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
    }

    return `${titleDate}`;
  };
  const getChain = () => {
    const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
    Object.keys(chainObjTemp).forEach((chainName) => {
      if (Object.keys(chainObjTemp[chainName]).length === 0) {
        delete chainObjTemp[chainName];
      }
    });
    return Object.keys(chainObjTemp);
  };
  const isDisplay = () => {
    if (Object.keys(display).length > 0) {
      if (getChain().length === Object.keys(display).length) {
        return <p>All Points of sales</p>;
      }
      if (getChain().length > 2) {
        return `${getChain().length} selected vendors`;
      }
      return getChain().join(', ');
    }
    if (vendorsSelected.length === vendors.length) {
      return <p>All Points of sales</p>;
    }
    if (vendorsSelected.length > 2) {
      return `${vendorsSelected.length} selected vendors`;
    }
    return <p> {vendorsSelected.join(', ')}</p>;
  };
  const financeLinks = ['revenue', 'n_orders', 'average_basket', 'profit'];
  return (
    <div className='block'>
      <TypographyKit variant='h4'>
        <p>{getbeforePeriod()}</p>
        <span> results for </span>
        {isDisplay()}
      </TypographyKit>
      <div className='cardsWrapper finance-wrapper'>
        {financeLinks.map((info) => (
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

export default Finance;
