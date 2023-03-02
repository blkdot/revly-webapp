import Dates from 'components/dates/Dates';
import Navbar from 'components/navbar/Navbar';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { DateRange, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const isDashboard = (path: string) => path === '/dashboard';

const isListing = (path: string) => path === '/competition/listing';

const isOffer = (path: string) =>
  ['/marketing/ads', '/marketing/offer', '/planning', '/adverts'].includes(path);

export const MainLayout = () => {
  const { pathname } = useLocation();

  const [vendors, setVendors] = useState<unknown[]>([]);

  const [current, setCurrent] = useState<DateRange>({
    from: dayjs().startOf('week'),
    until: dayjs().subtract(1, 'day').endOf('day'),
  });
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
      titleDate: 'current week',
      titleAfterPeriod: 'last week',
      typeDate: 'week',
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
