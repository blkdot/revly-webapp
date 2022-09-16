// TODO: fix all linter problem
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  endOfMonth,
  endOfWeek,
  getWeek,
  getMonth,
  lastDayOfMonth,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import DatePickerKit from '../../kits/datePicker/DatePickerKit';
import ButtonKit from '../../kits/button/ButtonKit';
import useDate from '../../hooks/useDate';
import { DateSelect } from './DateSelect';
import RightDateSelect from './RightDateSelect';
import LocalizationProviderKit from '../../kits/localizationProvider/LocalizationProviderkit';
import MonthPickerKit from '../../kits/monthPicker/MonthPickerKit';

const Dates = () => {
  const {
    setLeft,
    setRight,
    leftDate: left,
    rightDate: right,
    setTitleDate,
    titleDate,
    setTitleRightDate,
    titleRightDate,
  } = useDate();
  const [opened, setOpened] = useState(false);
  const [openedRight, setOpenedRight] = useState(false);
  const [selected, setSelected] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [typeDate, setTypeDate] = useState('day');
  const [title, setTitle] = useState(titleDate);
  const [leftDateBtn, setLeftDateBtn] = useState({
    startDate: left.startDate,
    endDate: left.endDate,
  });
  const [leftDate, setLeftDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [rightDate, setRightDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const location = useLocation();

  const handleClick = () => {
    // handleClick happens when you click on button "OK" on Left date picker
    const startDate = new Date(leftDate[0].startDate);
    const endDate = new Date(leftDate[0].endDate);
    setOpened(false); // Closing Left date picker
    if (location.pathname === '/dashboard') {
      setLeft({ startDate, endDate }); // Sending data to context state
      setRight({ startDate, endDate }); // Sending data to context state
    } else {
      setLeftDateBtn({ startDate, endDate });
    }

    const date = new Date();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();
    const dateLocal = date.toLocaleDateString();

    if (location.pathname === '/dashboard') {
      if (startLocal === endLocal) {
        // It checks that what date is currently selected in Left date picker
        if (startLocal === dateLocal) {
          setTitleDate('today'); // Sending data to state which will be needed for the introduction in the left input
          setTitleRightDate('today'); // Sending data to state which will be needed for the introduction in the right input
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setTitleDate('yesterday');
          setTitleRightDate('yesterday');
        } else {
          setTitleDate('custom');
          setTitleRightDate('csutom');
        }
      } else if (getWeek(startDate, 1) === getWeek(endDate, 1)) {
        if (endGetDay === dateGetDay && startGetDay === 0) {
          setTitleDate('current week');
          setTitleRightDate('current week');
        } else if (
          startGetDay === 0 &&
          endGetDay === 6 &&
          getWeek(startDate) === getWeek(subWeeks(date, 1))
        ) {
          setTitleDate('last week');
          setTitleRightDate('last week');
        } else {
          setTitleDate('custom');
          setTitleRightDate('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
        if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
          setTitleDate('current month');
          setTitleRightDate('current month');
        } else if (startGetDate === 1 && endGetDate === dateGetDate) {
          setTitleDate('last month');
          setTitleRightDate('last month');
        } else {
          setTitleDate('custom');
          setTitleRightDate('custom');
        }
      } else if (
        startGetDate === 1 &&
        endGetDate <= dateGetDate &&
        endGetDate === endOfMonth(endDate).getDate()
      ) {
        setTitleDate('current month');
        setTitleRightDate('current month');
      } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitleDate('last month');
        setTitleRightDate('last month');
      } else {
        setTitleDate('custom');
        setTitleRightDate('custom');
      }
    } else if (startLocal === endLocal) {
      // It checks that what date is currently selected in Left date picker
      if (startLocal === dateLocal) {
        setTitle('today'); // Sending data to state which will be needed for the introduction in the left input
      } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitle('yesterday');
      } else {
        setTitle('custom');
      }
    } else if (getWeek(startDate, 1) === getWeek(endDate, 1)) {
      if (endGetDay === dateGetDay && startGetDay === 0) {
        setTitle('current week');
      } else if (
        startGetDay === 0 &&
        endGetDay === 6 &&
        getWeek(startDate) === getWeek(subWeeks(date, 1))
      ) {
        setTitle('last week');
      } else {
        setTitle('custom');
      }
    } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        setTitle('current month');
      } else if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitle('last month');
      } else {
        setTitle('custom');
      }
    } else if (
      startGetDate === 1 &&
      endGetDate <= dateGetDate &&
      endGetDate === endOfMonth(endDate).getDate()
    ) {
      setTitle('current month');
    } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
      setTitle('last month');
    } else {
      setTitle('custom');
    }
  };
  const handleClickRight = () => {
    // handleClickRight happens when you click on button "OK" on Right date picker
    const startDate = new Date(rightDate[0].startDate);
    const endDate = new Date(rightDate[0].endDate);
    setOpenedRight(false); // Closing Right date picker
    setSelected(false); // Closing Right Select
    setRight({ startDate, endDate }); // Sending data to context state

    const date = new Date();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();
    const dateLocal = date.toLocaleDateString();

    if (startLocal === endLocal) {
      // It checks that what date is currently selected in Right date picker
      if (startLocal === dateLocal) {
        // Sending data to state which will be needed for the introduction in the right input
        setTitleRightDate('today');
      } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitleRightDate('yesterday');
      } else {
        setTitleRightDate('custom');
      }
    } else if (getWeek(startDate, 1) === getWeek(endDate, 1)) {
      if (endGetDay === dateGetDay && startGetDay === 0) {
        setTitleRightDate('current week');
      } else if (
        startGetDay === 0 &&
        endGetDay === 6 &&
        getWeek(startDate) === getWeek(subWeeks(date, 1))
      ) {
        setTitleRightDate('last week');
      } else {
        setTitleRightDate('custom');
      }
    } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        setTitleRightDate('current month');
      } else if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitleRightDate('last month');
      } else {
        setTitleRightDate('custom');
      }
    } else if (
      startGetDate === 1 &&
      endGetDate <= dateGetDate &&
      endGetDate === endOfMonth(endDate).getDate()
    ) {
      setTitleRightDate('current month');
    } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
      setTitleRightDate('last month');
    } else {
      setTitleRightDate('custom');
    }
  };

  const handleOnChangeRight = (ranges) => {
    // handleOnChagneRight happens when you click on some day on Right date picker
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setRightDate([selection]);
      } else if (typeDate === 'week') {
        setRightDate([
          {
            startDate: startOfWeek(selection.startDate), // here we send start of week
            endDate:
              getWeek(new Date()) === getWeek(selection.startDate)
                ? new Date()
                : endOfWeek(selection.startDate), // here we compare if the week of today is equal to the week of the clicked day
            key: 'selection',
          },
        ]);
      }
    } else if (typeDate === 'day') {
      setRightDate([selection]);
    } else if (typeDate === 'week') {
      setRightDate([
        {
          startDate: startOfWeek(selection.startDate), // here we send start of week
          endDate: endOfWeek(selection.startDate), // here we send end of week
          key: 'selection',
        },
      ]);
    }
  };

  const handleOnChange = (ranges) => {
    // handleOnChagne happens when you click on some day on Left date picker
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setLeftDate([selection]);
      } else if (typeDate === 'week') {
        setLeftDate([
          {
            startDate: startOfWeek(selection.startDate), // here we send start of week
            endDate:
              getWeek(new Date()) === getWeek(selection.startDate)
                ? new Date()
                : endOfWeek(selection.startDate), // here we compare if the week of today is equal to the week of the clicked day
            key: 'selection',
          },
        ]);
      }
    } else if (typeDate === 'day') {
      setLeftDate([selection]);
    } else if (typeDate === 'week') {
      setLeftDate([
        {
          startDate: startOfWeek(selection.startDate), // here we send start of week
          endDate: endOfWeek(selection.startDate), // here we send end of week
          key: 'selection',
        },
      ]);
    }
  };

  const getRightDate = () => {
    // This function should check if the date of the left date is the same as the date of the right date
    const date = new Date();
    const startDate = new Date(left.startDate);
    const endDate = new Date(left.endDate);
    const startDateRight = new Date(rightDate[0].startDate);
    const endDateRight = new Date(rightDate[0].endDate);
    const startLocalRight = startDateRight.toLocaleDateString();
    const endLocalRight = endDateRight.toLocaleDateString();
    const startGetDateRight = startDateRight.getDate();
    const endGetDateRight = endDateRight.getDate();
    const startGetDayRight = startDateRight.getDay();
    const endGetDayRight = endDateRight.getDay();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();

    if (getMonth(startDateRight) === getMonth(date)) {
      if (startLocal === endLocal) {
        if (startLocalRight === endLocalRight) return true;
        return false;
      }
      if (
        getWeek(startDate, 1) === getWeek(endDate, 1) &&
        startGetDay === 0 &&
        endGetDay >= dateGetDay &&
        startGetDay <= 6
      ) {
        if (
          startGetDayRight === 0 &&
          endGetDayRight >= dateGetDay &&
          startGetDayRight <= endOfWeek(startDateRight)
        )
          return true;
        return false;
      }
      if (
        getMonth(startDate, 1) === getMonth(endDate, 1) &&
        startGetDate === 1 &&
        endGetDate >= dateGetDate &&
        startGetDate <= lastDayOfMonth(endDate).getDate()
      ) {
        if (
          startGetDateRight === 1 &&
          endGetDateRight >= dateGetDate &&
          startGetDateRight <= lastDayOfMonth(endDateRight).getDate()
        )
          return true;
        return false;
      }
      if (startGetDate - endGetDate === startGetDateRight - endGetDateRight) return true;
      return false;
    }
    if (
      getWeek(startDate, 1) === getWeek(endDate, 1) &&
      startGetDay === 0 &&
      endGetDay >= dateGetDay &&
      startGetDay <= 6
    ) {
      if (startGetDayRight === 0 && endGetDayRight === endOfWeek(endDateRight).getDay())
        return true;
      return false;
    }
    if (
      getMonth(startDate, 1) === getMonth(endDate, 1) &&
      startGetDate === 1 &&
      endGetDate >= dateGetDate &&
      startGetDate <= lastDayOfMonth(endDate).getDate()
    ) {
      if (startGetDateRight === 1 && endGetDateRight === endOfMonth(endDateRight).getDate())
        return true;
      return false;
    }
    if (startGetDate - endGetDate === startGetDateRight - endGetDateRight) return true;
    return false;
  };

  const minDate = dayjs('2021-01-01T00:00:00.000');
  const maxDate = new Date();

  return (
    <div className="dates">
      <div className="date-picker_wrapper">
        <PaperKit
          style={{ background: '#fff' }}
          component="div"
          onClick={() => setOpened(true)}
          className="date-input">
          <TypographyKit className="date-typography">
            <CalendarMonthIcon />
            <span>
              {
                location.pathname === '/dashboard'
                  ? titleDate === 'custom' // if titleDate === "custom"  i return the date
                    ? new Date(left.startDate).toLocaleDateString() ===
                      new Date(left.endDate).toLocaleDateString()
                      ? new Date(left.startDate).toLocaleDateString()
                      : `${new Date(left.startDate).toLocaleDateString()} - ${new Date(
                          left.endDate,
                        ).toLocaleDateString()}`
                    : titleDate // if titleDate !== "custom" i only return titleDate ("today", "yesterday", "current week" and etc)
                  : title === 'custom' // if title === "custom"  i return the date
                  ? new Date(leftDateBtn.startDate).toLocaleDateString() ===
                    new Date(leftDateBtn.endDate).toLocaleDateString()
                    ? new Date(leftDateBtn.startDate).toLocaleDateString()
                    : `${new Date(leftDateBtn.startDate).toLocaleDateString()} - ${new Date(
                        leftDateBtn.endDate,
                      ).toLocaleDateString()}`
                  : title // if title !== "custom" i only return titleDate ("today", "yesterday", "current week" and etc)
              }
            </span>
          </TypographyKit>
          <ExpandMoreIcon />
        </PaperKit>
      </div>
      <div
        className={`date-range ${opened ? 'opened ' : ''}${typeDate === 'month' ? 'month' : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <PaperKit style={{ background: '#fff' }} className="date-picker">
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index="1"
            type="day"
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index="2"
            type="week"
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index="3"
            type="month"
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <div className="date-btn-wrapper">
            <ButtonKit onClick={handleClick} className="date-save-btn " variant="contained">
              Ok
            </ButtonKit>
          </div>
        </PaperKit>
        {typeDate === 'month' ? (
          <LocalizationProviderKit dateAdapter={AdapterDayjs}>
            <MonthPickerKit
              className="month_picker"
              date={dayjs(leftDate[0].startDate)}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(newDateMonth) =>
                setLeftDate([
                  {
                    startDate: startOfMonth(new Date(newDateMonth)),
                    endDate: endOfMonth(new Date(newDateMonth)),
                    key: 'selection',
                  },
                ])
              }
            />
          </LocalizationProviderKit>
        ) : (
          <DatePickerKit
            onRangeFocusChange={(e) => e}
            minDate={new Date(minDate)}
            maxDate={new Date()}
            onChange={handleOnChange}
            showSelectionPreview
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={leftDate}
            direction="horizontal"
            dragSelectionEnabled={false}
          />
        )}
      </div>
      {location.pathname === '/dashboard' ? (
        <div className="dashboard-date">
          <span>Compare to</span>
          <div className="date-picker_wrapper">
            <TypographyKit component="div" className="date-input-wrapper">
              <PaperKit
                style={{ background: '#fff' }}
                onClick={() => setSelected(!selected)}
                className={`date-input ${selected ? 'selected' : ''}`}>
                <TypographyKit component="div" className="date-typography">
                  <CalendarMonthIcon />
                  <span>
                    {
                      titleRightDate === 'custom' // if titleRightDate === "custom"  i return the date
                        ? new Date(right.startDate).toLocaleDateString() ===
                          new Date(right.endDate).toLocaleDateString()
                          ? new Date(right.startDate).toLocaleDateString()
                          : `${new Date(right.startDate).toLocaleDateString()} - ${new Date(
                              right.endDate,
                            ).toLocaleDateString()}`
                        : titleRightDate // if titleRightDate !== "custom" i only return titleDate ("today", "yesterday", "current week" and etc)
                    }
                  </span>
                </TypographyKit>
                <ExpandMoreIcon />
              </PaperKit>
              <RightDateSelect
                setRightDateBtn={setRight}
                setOpenedRight={setOpenedRight}
                setRightDate={setRightDate}
                selected={selected}
                leftDate={left}
                setTitleRight={setTitleRightDate}
              />
            </TypographyKit>
          </div>
          <div
            className={`date-range range-right ${openedRight ? 'opened' : ''}`}
            onClick={(e) => e.stopPropagation()}>
            <PaperKit style={{ background: '#fff' }} className="date-picker">
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="1"
                type="day"
                setSelections={setRightDate}
                setTypeDate={setTypeDate}
                leftDate={rightDate}
              />
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="2"
                type="week"
                setSelections={setRightDate}
                setTypeDate={setTypeDate}
                leftDate={rightDate}
              />
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="3"
                type="month"
                setSelections={setRightDate}
                setTypeDate={setTypeDate}
                leftDate={rightDate}
              />
              <div className="date-btn-wrapper">
                <ButtonKit
                  disabled={!getRightDate()}
                  onClick={handleClickRight}
                  className={`date-save-btn ${getRightDate() ? '' : 'date-disabled-btn'}`}
                  variant="contained">
                  Ok
                </ButtonKit>
              </div>
            </PaperKit>
            {typeDate === 'month' ? (
              <LocalizationProviderKit dateAdapter={AdapterDayjs}>
                <MonthPickerKit
                  className="month_picker"
                  date={dayjs(rightDate[0].startDate)}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newDateMonth) =>
                    setRightDate([
                      {
                        startDate: startOfMonth(new Date(newDateMonth)),
                        endDate: endOfMonth(new Date(newDateMonth)),
                        key: 'selection',
                      },
                    ])
                  }
                />
              </LocalizationProviderKit>
            ) : (
              <DatePickerKit
                onRangeFocusChange={(e) => e}
                minDate={new Date(minDate)}
                maxDate={new Date()}
                onChange={handleOnChangeRight}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={rightDate}
                direction="horizontal"
                dragSelectionEnabled={false}
              />
            )}
          </div>
        </div>
      ) : (
        ''
      )}
      <div
        className={`date-range-overlay ${opened ? 'opened' : ''}`}
        onClick={() => setOpened(false)}
      />
      <div
        className={`date-range-overlay ${openedRight ? 'opened' : ''}`}
        onClick={() => setOpenedRight(false)}
      />
    </div>
  );
};

Dates.propTypes = {
  onChange: PropTypes.func,
};

export default React.memo(Dates);
