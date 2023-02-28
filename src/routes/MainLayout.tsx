import Dates from 'components/dates/Dates';
import Navbar from 'components/navbar/Navbar';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { DateRange, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { ContainerKit } from 'kits';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const isDashboard = (path: string) => path === '/dashboard';

const isListing = (path: string) => path === '/competition/listing';

const isOffer = (path: string) =>
  ['/marketing/ads', '/marketing/offer', '/planning', '/adverts'].includes(path);

export const MainLayout = () => {
  const [vendors, setVendors] = useState<unknown[]>([]);

  const [before, setBefore] = useState<DateRange>({
    from: dayjs(new Date()),
    until: dayjs(new Date()),
  });
  const [after, setAfter] = useState<DateRange>({
    from: dayjs(new Date()),
    until: dayjs(new Date()),
  });

  const dates = useMemo(
    () => ({
      before,
      after,
    }),
    [after, before]
  );

  const { pathname } = useLocation();

  return (
    <div className='user-page'>
      <Navbar />
      <VendorsProvider value={vendors}>
        <DatesProvider value={dates}>
          <ContainerKit>
            <div className='top-inputs'>
              <RestaurantDropdown />
              <Dates
                isDashboard={isDashboard(pathname)}
                offer={isOffer(pathname)}
                isListing={isListing}
              />
            </div>
            <Outlet />
          </ContainerKit>
        </DatesProvider>
      </VendorsProvider>
    </div>
  );
};
