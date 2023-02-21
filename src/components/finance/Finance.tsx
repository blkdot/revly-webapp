import { FC } from 'react';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import { endOfMonth, format, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useDate } from 'hooks';
import { TypographyKit } from 'kits';
import { vendorsAtom } from 'store/vendorsAtom';
import { useAtom } from 'jotai';
import Widget from '../widget/Widget';
import './Finance.scss';

const Finance: FC<{
  metricsbeforePeriod: any;
  metricsafterPeriod: any;
  setTable: any;
  table: any;
  loading: any;
  links: any;
}> = ({
  metricsbeforePeriod,
  metricsafterPeriod,
  setTable,
  table,
  loading,
  links,
}) => {
    const { date } = useDate();
    const { beforePeriod, titleDate } = date;
    const startDate = new Date(beforePeriod.startDate);
    const endDate = new Date(beforePeriod.endDate);
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const [vendors] = useAtom(vendorsAtom);
    const { display, chainData } = vendors;
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
    const isDisplay = () => {
      if (selectedVendors('name', display).length === chainData.length) {
        return <p>All Points of sales</p>;
      }
      if (selectedVendors('name', display).length > 2) {
        return `${selectedVendors('name', display).length} selected vendors`;
      }
      return selectedVendors('name', display).join(', ');
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
              links={links}
            />
          ))}
        </div>
      </div>
    );
  };

export default Finance;
