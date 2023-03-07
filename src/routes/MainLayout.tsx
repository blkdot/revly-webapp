import Navbar from 'components/navbar/Navbar';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { DatesContextType, DatesProvider } from 'contexts';
import { VendorsProvider } from 'contexts/VendorsContext';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  currentWeek,
  DatePeriod,
  lastWeek,
  Old,
  OldDatePeriod,
  periodFromJSON,
  periodToJSON,
} from 'types';
import Dates from './dates/Dates';

const isDashboard = (path: string) => path === '/dashboard';

const isOffer = (path: string) =>
  ['/marketing/ads', '/marketing/offer', '/planning', '/adverts'].includes(path);

const loadCalendar = () => localStorage.getItem('calendar') || 'week';

const loadCurrent = () => periodFromJSON(localStorage.getItem('current') || '{}', currentWeek());
const loadCurrentTitle = () => localStorage.getItem('currentTitle') || 'current week';

const loadCompare = () => periodFromJSON(localStorage.getItem('compare') || '{}', lastWeek());
const loadCompareTitle = () => localStorage.getItem('compareTitle') || 'last week';

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

const toOldBeforePeriod = (period: DatePeriod): OldDatePeriod => ({
  startDate: period.from.toDate(),
  endDate: period.until.toDate(),
});

export const MainLayout = () => {
  const { pathname } = useLocation();

  const [vendors, setVendors] = useState<unknown[]>([]);

  const [calendar, setCalendar] = useState(loadCalendar());

  const [current, setCurrent] = useState(loadCurrent());
  const [currentTitle, setCurrentTitle] = useState(loadCurrentTitle());

  const [compare, setCompare] = useState(loadCompare());
  const [compareTitle, setCompareTitle] = useState(loadCompareTitle());

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

  const oldBeforePeriod = useMemo(() => toOldBeforePeriod(current), [current]);
  const setOldBeforePeriod = useCallback(
    (v: OldDatePeriod) => setCurrent({ from: dayjs(v.startDate), until: dayjs(v.endDate) }),
    []
  );

  useEffect(() => {
    localStorage.setItem('calendar', calendar);
  }, [calendar]);

  useEffect(() => {
    localStorage.setItem('current', periodToJSON(current));
  }, [current]);

  useEffect(() => {
    localStorage.setItem('currentTitle', currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    localStorage.setItem('compare', periodToJSON(compare));
  }, [compare]);

  useEffect(() => {
    localStorage.setItem('compareTitle', compareTitle);
  }, [compareTitle]);

  return (
    <div className='user-page'>
      <Navbar />
      <div className='wrapper'>
        <div className='top-inputs'>
          <RestaurantDropdown />
          <Dates
            isDashboard={isDashboard(pathname)}
            offer={isOffer(pathname)}
            dateContext={old}
            setDateContext={setOld}
            beforePeriodBtn={oldBeforePeriod}
            setBeforePeriodBtn={setOldBeforePeriod}
          />
        </div>
        <VendorsProvider value={vendors}>
          <DatesProvider value={dates}>
            <Outlet />
          </DatesProvider>
        </VendorsProvider>
      </div>
    </div>
  );
};
