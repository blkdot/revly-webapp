import Navbar from 'components/navbar/Navbar';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { DateRange, DatesContextType, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Old } from 'types';
import Dates from './dates/Dates';

const isDashboard = (path: string) => path === '/dashboard';

const isListing = (path: string) => path === '/competition/listing';

const isOffer = (path: string) =>
  ['/marketing/ads', '/marketing/offer', '/planning', '/adverts'].includes(path);

const toOld = (v: DatesContextType): Old => ({
  beforePeriod: {
    startDate: v.current.from.toDate(),
    endDate: v.current.until.toDate(),
  },
  afterPeriod: {
    startDate: v.compare.from.toDate(),
    endDate: v.compare.until.toDate(),
  },
  titleDate: v.currentTitle,
  titleAfterPeriod: v.compareTitle,
  typeDate: v.calendar,
});

export const MainLayout = () => {
  const { pathname } = useLocation();

  const [vendors, setVendors] = useState<unknown[]>([]);

  const [calendar, setCalendar] = useState('week');

  const [currentTitle, setCurrentTitle] = useState('current week');
  const [current, setCurrent] = useState<DateRange>({
    from: dayjs().startOf('week'),
    until: dayjs().subtract(1, 'day').endOf('day'),
  });

  const [compareTitle, setCompareTitle] = useState('last week');
  const [compare, setCompare] = useState<DateRange>({
    from: dayjs().subtract(1, 'week').startOf('week'),
    until: dayjs().subtract(1, 'week').endOf('week'),
  });

  const dates = useMemo(
    () => ({
      current,
      setCurrent,
      compare,
      setCompare,
      calendar,
      setCalendar,
      currentTitle,
      setCurrentTitle,
      compareTitle,
      setCompareTitle,
    }),
    [compare, current]
  );

  const old = useMemo(() => toOld(dates), [dates]);
  const setOld = useCallback((v: Old) => {
    setCurrent({ from: dayjs(v.beforePeriod.startDate), until: dayjs(v.beforePeriod.endDate) });
    setCompare({ from: dayjs(v.afterPeriod.startDate), until: dayjs(v.afterPeriod.endDate) });
    setCalendar(v.typeDate);
    setCurrentTitle(v.titleDate);
    setCompareTitle(v.titleAfterPeriod);
  }, []);

  return (
    <div className='user-page'>
      <Navbar />
      <VendorsProvider value={vendors}>
        <DatesProvider value={dates}>
          <div className='wrapper'>
            <div className='top-inputs'>
              <RestaurantDropdown />
              <Dates
                isDashboard={isDashboard(pathname)}
                offer={isOffer(pathname)}
                isListing={isListing(pathname)}
                dateContext={old}
                setDateContext={setOld}
              />
            </div>
            <Outlet />
          </div>
        </DatesProvider>
      </VendorsProvider>
    </div>
  );
};
