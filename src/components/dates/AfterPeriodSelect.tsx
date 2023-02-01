import {
  endOfMonth,
  endOfWeek,
  getMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ButtonKit, PaperKit } from 'kits';
import React from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';

const date = new Date();

const Day = ({
  setTitleAfterPeriod,
  setafterPeriodBtn,
  startDateLeft,
  endDateLeft,
  openAfterPeriod,
  titlebeforePeriodContext,
  setDateContext,
  dateContext,
}) => (
  <div>
    {titlebeforePeriodContext === 'yesterday' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className='navbar-button-kit'
        onClick={() => {
          setafterPeriodBtn({
            startDate: subDays(date, 1),
            endDate: subDays(date, 1),
          });
          setTitleAfterPeriod('yesterday');
          setDateContext({
            ...dateContext,
            afterPeriod: {
              startDate: subDays(date, 1),
              endDate: subDays(date, 1),
            },
            titleafterPeriod: 'yesterday',
          });
        }}
      >
        Yesterday
      </ButtonKit>
    )}
    <ButtonKit
      className='navbar-button-kit'
      onClick={() => {
        setafterPeriodBtn({
          startDate: subDays(startDateLeft, 1),
          endDate: subDays(endDateLeft, 1),
        });
        setTitleAfterPeriod('day before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subDays(startDateLeft, 1),
            endDate: subDays(endDateLeft, 1),
          },
          titleafterPeriod: 'day before',
        });
      }}
    >
      Day before
    </ButtonKit>
    <ButtonKit
      className='navbar-button-kit'
      onClick={() => {
        setafterPeriodBtn({
          startDate: subWeeks(startDateLeft, 1),
          endDate: subWeeks(endDateLeft, 1),
        });
        setTitleAfterPeriod('same day last week');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subWeeks(startDateLeft, 1),
            endDate: subWeeks(endDateLeft, 1),
          },
          titleafterPeriod: 'same day last week',
        });
      }}
    >
      Same day last week
    </ButtonKit>
    <ButtonKit className='navbar-button-kit' onClick={openAfterPeriod}>
      Custom Day
    </ButtonKit>
  </div>
);
const Week = ({
  setTitleAfterPeriod,
  setafterPeriodBtn,
  startDateLeft,
  endDateLeft,
  openAfterPeriod,
  titlebeforePeriodContext,
  setDateContext,
  dateContext,
}) => (
  <div>
    {titlebeforePeriodContext === 'last week' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className='navbar-button-kit'
        onClick={() => {
          setafterPeriodBtn({
            startDate: startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
          });
          setTitleAfterPeriod('last week');
          setDateContext({
            ...dateContext,
            afterPeriod: {
              startDate: startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
              endDate: endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
            },
            titleafterPeriod: 'last week',
          });
        }}
      >
        Last week
      </ButtonKit>
    )}
    <ButtonKit
      className='navbar-button-kit'
      onClick={() => {
        setafterPeriodBtn({
          startDate: startOfWeek(subWeeks(startDateLeft, 1), { weekStartsOn: 1 }),
          endDate: endOfWeek(subWeeks(endDateLeft, 1), { weekStartsOn: 1 }),
        });
        setTitleAfterPeriod('week before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: startOfWeek(subWeeks(startDateLeft, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(endDateLeft, 1), { weekStartsOn: 1 }),
          },
          titleafterPeriod: 'week before',
        });
      }}
    >
      Week before
    </ButtonKit>
    <ButtonKit className='navbar-button-kit' onClick={openAfterPeriod}>
      Custom Week
    </ButtonKit>
  </div>
);
const Month = ({
  setTitleAfterPeriod,
  setafterPeriodBtn,
  openAfterPeriod,
  titlebeforePeriodContext,
  setDateContext,
  dateContext,
  startDateLeft,
  year,
  setYear,
}) => (
  <div>
    {titlebeforePeriodContext === 'last month' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className='navbar-button-kit'
        onClick={() => {
          setafterPeriodBtn({
            startDate: startOfMonth(subMonths(date, 1)),
            endDate: endOfMonth(subMonths(date, 1)),
          });
          setTitleAfterPeriod('last month');
          setDateContext({
            ...dateContext,
            afterPeriod: {
              startDate: startOfMonth(subMonths(date, 1)),
              endDate: endOfMonth(subMonths(date, 1)),
            },
            titleafterPeriod: 'last month',
          });
        }}
      >
        Last month
      </ButtonKit>
    )}
    <ButtonKit
      className='navbar-button-kit'
      onClick={() => {
        setafterPeriodBtn({
          startDate: startOfMonth(subMonths(startDateLeft, 1)).setFullYear(
            getMonth(date) === 0 ? year - 1 : year
          ),
          endDate: endOfMonth(subMonths(startDateLeft, 1)).setFullYear(
            getMonth(date) === 0 ? year - 1 : year
          ),
        });
        setTitleAfterPeriod('month before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: startOfMonth(subMonths(startDateLeft, 1)).setFullYear(
              getMonth(date) === 0 ? year - 1 : year
            ),
            endDate: endOfMonth(subMonths(startDateLeft, 1)).setFullYear(
              getMonth(date) === 0 ? year - 1 : year
            ),
          },
          titleafterPeriod: 'month before',
        });
        setYear(getMonth(date) === 0 ? year - 1 : year);
      }}
    >
      Month before
    </ButtonKit>
    <ButtonKit className='navbar-button-kit' onClick={openAfterPeriod}>
      Custom Month
    </ButtonKit>
  </div>
);

const AfterPeriodSelect = ({
  setafterPeriod,
  afterPeriod,
  selected,
  setOpenedAfterPeriod,
  setafterPeriodBtn,
  setTitleAfterPeriod,
  beforePeriod,
  titlebeforePeriodContext,
  typeDate,
  setSelected,
  setDateContext,
  dateContext,
  year,
  setYear,
}) => {
  const startDate = new Date(afterPeriod.startDate);
  const endDate = new Date(afterPeriod.endDate);
  const startDateLeft = new Date(beforePeriod.startDate);
  const endDateLeft = new Date(beforePeriod.endDate);

  const openAfterPeriod = () => {
    setafterPeriod([{ startDate, endDate, key: 'selection' }]);
    setafterPeriodBtn({ startDate, endDate });
    setOpenedAfterPeriod(true);
    setSelected(false);
  };
  function render() {
    if (typeDate === 'day') {
      return (
        <Day
          titlebeforePeriodContext={titlebeforePeriodContext}
          openAfterPeriod={openAfterPeriod}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setafterPeriodBtn={setafterPeriodBtn}
          setTitleAfterPeriod={setTitleAfterPeriod}
          setDateContext={setDateContext}
          dateContext={dateContext}
        />
      );
    }
    if (typeDate === 'week') {
      return (
        <Week
          titlebeforePeriodContext={titlebeforePeriodContext}
          openAfterPeriod={openAfterPeriod}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setafterPeriodBtn={setafterPeriodBtn}
          setTitleAfterPeriod={setTitleAfterPeriod}
          setDateContext={setDateContext}
          dateContext={dateContext}
        />
      );
    }
    if (typeDate === 'month') {
      return (
        <Month
          titlebeforePeriodContext={titlebeforePeriodContext}
          openAfterPeriod={openAfterPeriod}
          setafterPeriodBtn={setafterPeriodBtn}
          setTitleAfterPeriod={setTitleAfterPeriod}
          setDateContext={setDateContext}
          dateContext={dateContext}
          startDateLeft={startDateLeft}
          year={year}
          setYear={setYear}
        />
      );
    }
    return '';
  }
  return (
    <PaperKit
      onClick={(e) => e.preventDefault()}
      style={{ background: '#fff' }}
      className={`date-select ${selected ? 'selected' : ''}`}
    >
      {render()}
    </PaperKit>
  );
};

export default React.memo(AfterPeriodSelect);
