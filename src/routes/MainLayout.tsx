import Navbar from 'components/navbar/Navbar';
import { DateRange, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { ContainerKit } from 'kits';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

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

  return (
    <div className='user-page'>
      <Navbar />
      <VendorsProvider value={vendors}>
        <DatesProvider value={dates}>
          <ContainerKit>
            <Outlet />
          </ContainerKit>
        </DatesProvider>
      </VendorsProvider>
    </div>
  );
};
