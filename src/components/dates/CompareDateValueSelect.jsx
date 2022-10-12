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
  setTitleCompareDateValue,
  setcompareDateValueBtn,
  startDateLeft,
  endDateLeft,
  openCompareDateValue,
  titledateFromContext,
}) => (
  <div>
    {titledateFromContext === 'yesterday' || titledateFromContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setcompareDateValueBtn({
            startDate: subDays(date, 1),
            endDate: subDays(date, 1),
          });
          setTitleCompareDateValue('yesterday');
        }}>
        Yesterday
      </ButtonKit>
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setcompareDateValueBtn({
          startDate: subDays(date, 1),
          endDate: subDays(date, 1),
        });
        setTitleCompareDateValue('the day before');
      }}>
      Day before
    </ButtonKit>
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setcompareDateValueBtn({
          startDate: subWeeks(startDateLeft, 1),
          endDate: subWeeks(endDateLeft, 1),
        });
        setTitleCompareDateValue('the same day last week');
      }}>
      Same day last week
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openCompareDateValue}>
      Custom Day
    </ButtonKit>
  </div>
);
const Week = ({
  setTitleCompareDateValue,
  setcompareDateValueBtn,
  startDateLeft,
  endDateLeft,
  openCompareDateValue,
  titledateFromContext,
}) => (
  <div>
    {titledateFromContext === 'last week' || titledateFromContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setcompareDateValueBtn({
            startDate: startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 }),
          });
          setTitleCompareDateValue('last week');
        }}>
        Last week
      </ButtonKit>
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setcompareDateValueBtn({
          startDate: startOfWeek(subWeeks(startDateLeft, 1), { weekStartsOn: 1 }),
          endDate: endOfWeek(subWeeks(endDateLeft, 1), { weekStartsOn: 1 }),
        });
        setTitleCompareDateValue('week before');
      }}>
      Week before
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openCompareDateValue}>
      Custom Week
    </ButtonKit>
  </div>
);
const Month = ({
  setTitleCompareDateValue,
  setcompareDateValueBtn,
  openCompareDateValue,
  titledateFromContext,
}) => (
  <div>
    {titledateFromContext === 'last month' || titledateFromContext === 'custom' ? (
      ''
    ) : (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setcompareDateValueBtn({
            startDate: startOfMonth(subMonths(date, 1)),
            endDate: endOfMonth(subMonths(date, 1)),
          });
          setTitleCompareDateValue('last month');
        }}>
        Last month
      </ButtonKit>
    )}

    <ButtonKit className="navbar-button-kit" onClick={openCompareDateValue}>
      Custom Month
    </ButtonKit>
  </div>
);

const CompareDateValueSelect = ({
  setcompareDateValue,
  compareDateValue,
  selected,
  setOpenedCompareDateValue,
  setcompareDateValueBtn,
  setTitleCompareDateValue,
  dateFrom,
  titledateFromContext,
  typeDate,
  setSelected,
}) => {
  const startDate = new Date(compareDateValue.startDate);
  const endDate = new Date(compareDateValue.endDate);
  const startDateLeft = new Date(dateFrom.startDate);
  const endDateLeft = new Date(dateFrom.endDate);

  const openCompareDateValue = () => {
    setcompareDateValue([{ startDate, endDate, key: 'selection' }]);
    setcompareDateValueBtn({ startDate, endDate });
    setOpenedCompareDateValue(true);
    setSelected(false);
  };

  function render() {
    if (typeDate === 'day') {
      return (
        <Day
          titledateFromContext={titledateFromContext}
          openCompareDateValue={openCompareDateValue}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setcompareDateValueBtn={setcompareDateValueBtn}
          setTitleCompareDateValue={setTitleCompareDateValue}
        />
      );
    }
    if (typeDate === 'week') {
      return (
        <Week
          titledateFromContext={titledateFromContext}
          openCompareDateValue={openCompareDateValue}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setcompareDateValueBtn={setcompareDateValueBtn}
          setTitleCompareDateValue={setTitleCompareDateValue}
        />
      );
    }
    if (typeDate === 'month') {
      return (
        <Month
          titledateFromContext={titledateFromContext}
          openCompareDateValue={openCompareDateValue}
          setcompareDateValueBtn={setcompareDateValueBtn}
          setTitleCompareDateValue={setTitleCompareDateValue}
        />
      );
    }
    return '';
  }
  return (
    <PaperKit
      onClick={(e) => e.preventDefault()}
      style={{ background: '#fff' }}
      className={`date-select ${selected ? 'selected' : ''}`}>
      {render()}
    </PaperKit>
  );
};

export default React.memo(CompareDateValueSelect);
