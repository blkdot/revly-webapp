import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React from 'react';
import {
  endOfMonth,
  subDays,
  subMonths,
  subWeeks,
  endOfWeek,
  startOfWeek,
  startOfMonth,
} from 'date-fns';
import PaperKit from '../../kits/paper/PaperKit';
import ButtonKit from '../../kits/button/ButtonKit';

const date = new Date();

const Day = ({
  setTitleAfterPeriod,
  setafterPeriodBtn,
  startDateLeft,
  endDateLeft,
  openAfterPeriod,
  titlebeforePeriodContext,
}) => (
  <div>
    {titlebeforePeriodContext === 'yesterday' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setafterPeriodBtn({
            startDate: subDays(date, 1),
            endDate: subDays(date, 1),
          });
          setTitleAfterPeriod('yesterday');
        }}
      >
        Yesterday
      </ButtonKit>
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setafterPeriodBtn({
          startDate: subDays(date, 1),
          endDate: subDays(date, 1),
        });
        setTitleAfterPeriod('the day before');
      }}
    >
      Day before
    </ButtonKit>
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setafterPeriodBtn({
          startDate: subWeeks(startDateLeft, 1),
          endDate: subWeeks(endDateLeft, 1),
        });
        setTitleAfterPeriod('the same day last week');
      }}
    >
      Same day last week
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openAfterPeriod}>
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
}) => (
  <div>
    {titlebeforePeriodContext === 'last week' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setafterPeriodBtn({
            startDate: startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
          });
          setTitleAfterPeriod('last week');
        }}
      >
        Last week
      </ButtonKit>
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setafterPeriodBtn({
          startDate: startOfWeek(subWeeks(startDateLeft, 1), { weekStartsOn: 1 }),
          endDate: endOfWeek(subWeeks(endDateLeft, 1), { weekStartsOn: 1 }),
        });
        setTitleAfterPeriod('week before');
      }}
    >
      Week before
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openAfterPeriod}>
      Custom Week
    </ButtonKit>
  </div>
);
const Month = ({
  setTitleAfterPeriod,
  setafterPeriodBtn,
  openAfterPeriod,
  titlebeforePeriodContext,
}) => (
  <div>
    {titlebeforePeriodContext === 'last month' || titlebeforePeriodContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setafterPeriodBtn({
            startDate: startOfMonth(subMonths(date, 1)),
            endDate: endOfMonth(subMonths(date, 1)),
          });
          setTitleAfterPeriod('last month');
        }}
      >
        Last month
      </ButtonKit>
    )}

    <ButtonKit className="navbar-button-kit" onClick={openAfterPeriod}>
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
