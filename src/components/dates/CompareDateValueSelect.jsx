import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React from 'react';
import {
  endOfMonth,
  getWeek,
  subDays,
  subMonths,
  subWeeks,
  getMonth,
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
}) => {
  const startDate = new Date(compareDateValue.startDate);
  const endDate = new Date(compareDateValue.endDate);
  const startDateLeft = new Date(dateFrom.startDate);
  const endDateLeft = new Date(dateFrom.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const startGetDay = startDate.getDay();
  const endGetDay = endDate.getDay();
  const dateGetDay = date.getDay();
  const dateGetDate = date.getDate();

  const openCompareDateValue = () => {
    setcompareDateValue([{ startDate, endDate, key: 'selection' }]);
    setcompareDateValueBtn({ startDate, endDate });
    setOpenedCompareDateValue(true);
  };

  function render() {
    if (getMonth(startDate) === getMonth(date)) {
      if (startLocal === endLocal)
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
      if (
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 }) &&
        startGetDay === 1 &&
        endGetDay >= dateGetDay &&
        endGetDay === 0
      )
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
      if (
        getMonth(startDate) === getMonth(endDate) &&
        startGetDate === 1 &&
        endGetDate >= dateGetDate &&
        endGetDate <= endOfMonth(endDate).getDate()
      )
        return (
          <Month
            titledateFromContext={titledateFromContext}
            openCompareDateValue={openCompareDateValue}
            setcompareDateValueBtn={setcompareDateValueBtn}
            setTitleCompareDateValue={setTitleCompareDateValue}
          />
        );
    } else if (startLocal === endLocal)
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
    else if (
      getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 }) &&
      startGetDay === 1 &&
      endGetDay === 0
    )
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
    else if (
      getMonth(startDate) === getMonth(endDate) &&
      startGetDate === 1 &&
      endGetDate === endOfMonth(endDate, 1).getDate()
    )
      return (
        <Month
          titledateFromContext={titledateFromContext}
          openCompareDateValue={openCompareDateValue}
          setcompareDateValueBtn={setcompareDateValueBtn}
          setTitleCompareDateValue={setTitleCompareDateValue}
        />
      );
    return '';
  }
  return (
    <PaperKit
      style={{ background: '#fff' }}
      className={`date-select ${selected ? 'selected' : ''}`}>
      {render()}
    </PaperKit>
  );
};

export default React.memo(CompareDateValueSelect);
