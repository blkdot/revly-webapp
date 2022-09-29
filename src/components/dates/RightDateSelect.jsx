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
  setTitleRight,
  setRightDateBtn,
  startDateLeft,
  endDateLeft,
  openRight,
  titleLeft,
}) => (
  <div>
    {titleLeft !== 'yesterday' ? (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setRightDateBtn({
            startDate: subDays(date, 1),
            endDate: subDays(date, 1),
          });
          setTitleRight('yesterday');
        }}>
        Yesterday
      </ButtonKit>
    ) : (
      ''
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setRightDateBtn({
          startDate: subDays(date, 1),
          endDate: subDays(date, 1),
        });
        setTitleRight('the day before');
      }}>
      Day before
    </ButtonKit>
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setRightDateBtn({
          startDate: subWeeks(startDateLeft, 1),
          endDate: subWeeks(endDateLeft, 1),
        });
        setTitleRight('the same day last week');
      }}>
      Same day last week
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openRight}>
      Custom Day
    </ButtonKit>
  </div>
);
const Week = ({
  setTitleRight,
  setRightDateBtn,
  startDateLeft,
  endDateLeft,
  openRight,
  titleLeft,
}) => (
  <div>
    {titleLeft !== 'last week' ? (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setRightDateBtn({
            startDate: startOfWeek(subWeeks(date, 1)),
            endDate: endOfWeek(subWeeks(date, 1)),
          });
          setTitleRight('last week');
        }}>
        Last week
      </ButtonKit>
    ) : (
      ''
    )}
    <ButtonKit
      className="navbar-button-kit"
      onClick={() => {
        setRightDateBtn({
          startDate: subWeeks(startDateLeft, 1),
          endDate: endOfWeek(subWeeks(endDateLeft, 1)),
        });
        setTitleRight('week before');
      }}>
      Week before
    </ButtonKit>
    <ButtonKit className="navbar-button-kit" onClick={openRight}>
      Custom Week
    </ButtonKit>
  </div>
);
const Month = ({ setTitleRight, setRightDateBtn, openRight, titleLeft }) => (
  <div>
    {titleLeft !== 'last month' ? (
      <ButtonKit
        className="navbar-button-kit"
        onClick={() => {
          setRightDateBtn({
            startDate: startOfMonth(subMonths(date, 1)),
            endDate: endOfMonth(subMonths(date, 1)),
          });
          setTitleRight('last month');
        }}>
        Last month
      </ButtonKit>
    ) : (
      ''
    )}

    <ButtonKit className="navbar-button-kit" onClick={openRight}>
      Custom Month
    </ButtonKit>
  </div>
);

const RightDateSelect = ({
  setRightDate,
  rightDate,
  selected,
  setOpenedRight,
  setRightDateBtn,
  setTitleRight,
  leftDate,
  titleLeft,
}) => {
  const startDate = new Date(rightDate.startDate);
  const endDate = new Date(rightDate.endDate);
  const startDateLeft = new Date(leftDate.startDate);
  const endDateLeft = new Date(leftDate.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const startGetDay = startDate.getDay();
  const endGetDay = endDate.getDay();
  const dateGetDay = date.getDay();
  const dateGetDate = date.getDate();

  const openRight = () => {
    setRightDate([{ startDate, endDate, key: 'selection' }]);
    setRightDateBtn({ startDate, endDate });
    setOpenedRight(true);
  };

  function render() {
    if (getMonth(startDate) === getMonth(date)) {
      if (startLocal === endLocal)
        return (
          <Day
            titleLeft={titleLeft}
            openRight={openRight}
            startDateLeft={startDateLeft}
            endDateLeft={endDateLeft}
            setRightDateBtn={setRightDateBtn}
            setTitleRight={setTitleRight}
          />
        );
      if (
        getWeek(startDate) === getWeek(endDate) &&
        startGetDay === 0 &&
        endGetDay >= dateGetDay &&
        endGetDay <= 6
      )
        return (
          <Week
            titleLeft={titleLeft}
            openRight={openRight}
            startDateLeft={startDateLeft}
            endDateLeft={endDateLeft}
            setRightDateBtn={setRightDateBtn}
            setTitleRight={setTitleRight}
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
            titleLeft={titleLeft}
            openRight={openRight}
            setRightDateBtn={setRightDateBtn}
            setTitleRight={setTitleRight}
          />
        );
    } else if (startLocal === endLocal)
      return (
        <Day
          titleLeft={titleLeft}
          openRight={openRight}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setRightDateBtn={setRightDateBtn}
          setTitleRight={setTitleRight}
        />
      );
    else if (getWeek(startDate) === getWeek(endDate) && startGetDay === 0 && endGetDay <= 6)
      return (
        <Week
          titleLeft={titleLeft}
          openRight={openRight}
          startDateLeft={startDateLeft}
          endDateLeft={endDateLeft}
          setRightDateBtn={setRightDateBtn}
          setTitleRight={setTitleRight}
        />
      );
    else if (
      getMonth(startDate) === getMonth(endDate) &&
      startGetDate === 1 &&
      endGetDate === endOfMonth(endDate, 1).getDate()
    )
      return (
        <Month
          titleLeft={titleLeft}
          openRight={openRight}
          setRightDateBtn={setRightDateBtn}
          setTitleRight={setTitleRight}
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

export default React.memo(RightDateSelect);
