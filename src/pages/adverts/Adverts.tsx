import { useState } from 'react';
import Dates from "components/dates/Dates";
import RestaurantDropdown from "components/restaurantDropdown/RestaurantDropdown";
import { endOfMonth, format, getYear, subDays } from "date-fns";
import { PaperKit, TypographyKit } from "kits";
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import dayjs from 'dayjs';
import { enUS } from 'date-fns/locale';
import { useDate } from 'hooks';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import './Adverts.scss';
import arrow from 'assets/images/arrow.svg';

const Adverts = () => {
  const { date } = useDate();
  const [vendors] = useAtom(vendorsAtom);
  const { display, vendorsArr } = vendors;
  const { beforePeriod, titleDate } = date;
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: beforePeriod.startDate,
    endDate: beforePeriod.endDate,
  });
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
  }
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
        <p>Here you can quickly and easily create and manage effective advertisements for their businesses.</p>
      </div>
      <PaperKit className='competition-paper adverts'>
        <div className='paper-top-link'>
          <div className='links'>
            <div>
              <p className='active'>Adverts List</p>
              <span>The list of your running adverts for Today</span>
            </div>
            <div>
              <p>
                Adverts Performance
              </p>
              <span>Performance Metrics of you running adverts for Today</span>
            </div>
          </div>
          <div className='arrows'>
            <img className='active' src={arrow} alt='left-arrow'/>
            <img src={arrow} alt='right-arrow' />
          </div>
        </div>
      </PaperKit>
    </div>
  )
}

export default Adverts