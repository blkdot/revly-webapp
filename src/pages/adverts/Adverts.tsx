import { useState } from 'react';
import Dates from 'components/dates/Dates';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { endOfMonth, format, getYear, subDays } from 'date-fns';
import { ButtonKit, PaperKit, TypographyKit } from 'kits';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import dayjs from 'dayjs';
import { enUS } from 'date-fns/locale';
import { useDate } from 'hooks';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import './Adverts.scss';
import arrow from 'assets/images/arrow.svg';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from 'components/tableRevly/TableRevly';

const Adverts = () => {
  const { date } = useDate();
  const [vendors] = useAtom(vendorsAtom);
  const { display, vendorsArr } = vendors;
  const { beforePeriod, titleDate } = date;
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: beforePeriod.startDate,
    endDate: beforePeriod.endDate,
  });
  const [link, setLink] = useState('list');
  const startDate = new Date(beforePeriodBtn.startDate);
  const endDate = new Date(beforePeriodBtn.endDate);
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
  const isDisplay = () => {
    if (selectedVendors('name', display).length === vendorsArr.length) {
      return 'All Points of sales';
    }
    if (selectedVendors('name', display).length > 2) {
      return `${selectedVendors('name', display).length} selected vendors`;
    }
    return selectedVendors('name', display).join(', ');
  };
  const headersList = [
    { id: 'brand_name', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'start_end_date', disablePadding: true, label: 'Start/Ending Date' },
    { id: 'start_end_hour', disablePadding: true, label: 'Start/Ending Hour' },
    { id: 'total_budget', disablePadding: true, label: 'Total Budget' },
    { id: 'budget_spent', disablePadding: true, label: 'Budget Spent' },
    { id: 'return_spent', disablePadding: true, label: 'Return on Spent' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const {
    renderCurrency,
    renderStatus,
    renderSimpleRowNotCentered,
    renderScheduleType,
    renderSimpleRow,
    renderVendorId,
    renderTimeSlot,
  } = useTableContentFormatter();
  const cellTemplatesObject = {
    brand_name: renderSimpleRowNotCentered,
    vendor_ids: renderVendorId,
    start_end_date: renderSimpleRow,
    start_end_hour: renderSimpleRow,
    total_budget: renderCurrency,
    budget_spent: renderScheduleType,
    return_spent: renderTimeSlot,
    platform: renderSimpleRow,
    status: renderStatus,
  };

  const renderRowsByHeaderList = (r) =>
    headersList.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_id }, cur),
        id: r,
        data: r,
      }),
      {}
    );
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates
          isListing
          beforePeriodBtn={beforePeriodBtn}
          setbeforePeriodBtn={setbeforePeriodBtn}
          defaultTitle='Yesterday'
          defaultTypeDate='day'
        />
      </div>
      <div className='adverts_top-titles'>
        <TypographyKit className='adverts-title' variant='subtitle'>
          Manage Advertisements for
          <span>{isDisplay()}</span>
          for
          <span>{getbeforePeriod()}</span>
        </TypographyKit>
        <p>
          Here you can quickly and easily create and manage effective advertisements for their
          businesses.
        </p>
      </div>
      <PaperKit className='competition-paper adverts'>
        <div className='paper-top-link'>
          <div className='links'>
            <div>
              <p className={link === 'list' ? 'active' : ''}>Adverts List</p>
              <span>The list of your running adverts for Today</span>
            </div>
            <div>
              <p className={link === 'performence' ? 'active' : ''}>Adverts Performance</p>
              <span>Performance Metrics of you running adverts for Today</span>
            </div>
            <div className='arrows'>
              <img
                tabIndex={-1}
                role='presentation'
                onClick={() => setLink('list')}
                className={link !== 'list' ? 'active' : ''}
                src={arrow}
                alt='left-arrow'
              />
              <img
                tabIndex={-1}
                role='presentation'
                onClick={() => setLink('performence')}
                className={link !== 'performence' ? 'active' : ''}
                src={arrow}
                alt='right-arrow'
              />
            </div>
          </div>
          <ButtonKit>
            Create new campaign
            <img src={arrow} alt='right-arrow' />
          </ButtonKit>
        </div>
        <TableRevly isLoading headers={headersList} rows={[].map(renderRowsByHeaderList)} />
      </PaperKit>
    </div>
  );
};

export default Adverts;
