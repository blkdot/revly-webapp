import Navbar from 'components/navbar/Navbar';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { DateRange, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Dates from './dates/Dates';

const isDashboard = (path: string) => path === '/dashboard';

const isListing = (path: string) => path === '/competition/listing';

const isOffer = (path: string) =>
  ['/marketing/ads', '/marketing/offer', '/planning', '/adverts'].includes(path);

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
                isListing={isListing}
              />
            </div>
            <Outlet />
          </div>
        </DatesProvider>
      </VendorsProvider>
    </div>
  );
};
