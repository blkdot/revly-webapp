import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useState } from 'react';
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
  format,
  getYear,
} from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from 'react-router-dom';
import { enUS } from 'date-fns/locale';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import DatePickerKit from '../../kits/datePicker/DatePickerKit';
import ButtonKit from '../../kits/button/ButtonKit';
import useDate from '../../hooks/useDate';
import DateSelect from './DateSelect';
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
    leftDateOffers,
    setLeftDateOffers,
    titleOffers,
    setTitleOffers,
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
      startDate: subDays(new Date(), 1),
      endDate: subDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  const location = useLocation();
  const handleClick = () => {
    // handleClick happens when you click on button "OK" on Left date picker

    // We put in variables for later use
    const startDate = new Date(leftDate[0].startDate);
    const endDate = new Date(leftDate[0].endDate);
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

    setOpened(false); // Closing Left date picker

    if (location.pathname === '/dashboard') {
      // its will work on dashboard
      setLeft({ startDate, endDate }); // Sending data to context state
      if (typeDate === 'day') {
        setRight({ startDate: subDays(startDate, 1), endDate: subDays(endDate, 1) }); // Sending previous day to context state
      } else if (typeDate === 'week') {
        setRight({ startDate: subWeeks(startDate, 1), endDate: endOfWeek(subWeeks(endDate, 1)) }); // Sending previous week to context state
      } else if (typeDate === 'month') {
        setRight({
          startDate: subMonths(startDate, 1),
          endDate: endOfMonth(subMonths(endDate, 1)),
        }); // Sending previous month to context state
      }
    }
    if (location.pathname === '/planning') {
      setLeftDateOffers({ startDate, endDate });
    } else {
      // its will work on other pages
      setLeftDateBtn({ startDate, endDate });
    }

    if (location.pathname === '/dashboard') {
      // its will work on dashboard
      if (startLocal === endLocal) {
        // It checks that what date is currently selected in Left date picker
        if (startLocal === dateLocal) {
          setTitleDate('today'); // Sending data to state which will be needed for the introduction in the left input
          setTitleRightDate('yesterday'); // Sending data to state which will be needed for the introduction in the right input
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setTitleDate('yesterday');
          setTitleRightDate('custom');
        } else {
          setTitleDate('custom');
          setTitleRightDate('custom');
        }
      } else if (getWeek(startDate, 1) === getWeek(endDate, 1)) {
        if (endGetDay === dateGetDay && startGetDay === 0) {
          setTitleDate('current week');
          setTitleRightDate('last week');
        } else if (
          startGetDay === 0 &&
          endGetDay === 6 &&
          getWeek(startDate) === getWeek(subWeeks(date, 1))
        ) {
          setTitleDate('last week');
          setTitleRightDate('custom');
        } else {
          setTitleDate('custom');
          setTitleRightDate('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
        if (startGetDate === 1 && endGetDate === dateGetDate) {
          setTitleDate('current month');
          setTitleRightDate('last month');
        } else if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
          setTitleDate('last month');
          setTitleRightDate('custom');
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
        setTitleRightDate('l month');
      } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitleDate('last month');
        setTitleRightDate('custom');
      } else {
        setTitleDate('custom');
        setTitleRightDate('custom');
      }
    } else if (location.pathname === '/planning') {
      if (startLocal === endLocal) {
        // It checks that what date is currently selected in Left date picker
        if (startLocal === dateLocal) {
          setTitleOffers('today'); // Sending data to state which will be needed for the introduction in the left input
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setTitleOffers('yesterday');
        } else {
          setTitleOffers('custom');
        }
      } else if (getWeek(startDate, 1) === getWeek(endDate, 1)) {
        if (endGetDay === dateGetDay && startGetDay === 0) {
          setTitleOffers('current week');
        } else if (
          startGetDay === 0 &&
          endGetDay === 6 &&
          getWeek(startDate) === getWeek(subWeeks(date, 1))
        ) {
          setTitleOffers('last week');
        } else {
          setTitleOffers('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
        if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
          setTitleOffers('current month');
        } else if (startGetDate === 1 && endGetDate === dateGetDate) {
          setTitleOffers('last month');
        } else {
          setTitleOffers('custom');
        }
      } else if (
        startGetDate === 1 &&
        endGetDate <= dateGetDate &&
        endGetDate === endOfMonth(endDate).getDate()
      ) {
        setTitleOffers('current month');
      } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitleOffers('last month');
      } else {
        setTitleOffers('custom');
      }
    } else if (location.pathname !== '/planning' && location.pathname !== '/dashboard') {
      // its will work on other pages
      if (startLocal === endLocal) {
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
    }
  };
  const handleClickRight = () => {
    // handleClickRight happens when you click on button "OK" on Right date picker

    // We put in variables for later use
    const startDate = new Date(rightDate[0].startDate);
    const endDate = new Date(rightDate[0].endDate);
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

    setOpenedRight(false); // Closing Right date picker
    setSelected(false); // Closing Right Select
    setRight({ startDate, endDate }); // Sending data to context state

    if (startLocal === endLocal) {
      // It checks that what date is currently selected in Right date picker

      // Sending data to state which will be needed for the introduction in the right input
      if (startLocal === dateLocal) {
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

  const handleOnChange = (ranges) => {
    // handleOnChagne happens when you click on some day on Left date picker
    const { selection } = ranges;
    const rdrDays = document.querySelectorAll('.rdrDay'); // here we took all span
    rdrDays.forEach((el) =>
      el.addEventListener(
        'dblclick',
        () => handleClick(), // When you double click this function will work
      ),
    );
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setLeftDate([selection]); // here we send day
      } else if (typeDate === 'week') {
        // These checks the typeDate
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
      // These checks the typeDate
      setLeftDate([selection]); // here we send day
    } else if (typeDate === 'week') {
      // These checks the typeDate
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

    // We put in variables for later use
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

    // This comparison needed for right date picker button, check if left date picker not more then chosed date and have the same type
    if (getMonth(startDateRight) === getMonth(date)) {
      // check if month of clicked date equal with today`s month
      if (startLocal === endLocal) {
        if (startLocalRight === endLocalRight && startLocal > startLocalRight) return true;
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
          startGetDayRight <= endOfWeek(startDateRight) &&
          getWeek(startDate, 1) > getWeek(startDateRight, 1)
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
          startGetDateRight <= lastDayOfMonth(endDateRight).getDate() &&
          getMonth(startDate, 1) > getMonth(startDateRight, 1)
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
      if (
        startGetDayRight === 0 &&
        endGetDayRight === endOfWeek(endDateRight).getDay() &&
        getWeek(startDate, 1) > getWeek(startDateRight, 1)
      )
        return true;
      return false;
    }
    if (
      getMonth(startDate, 1) === getMonth(endDate, 1) &&
      startGetDate === 1 &&
      endGetDate >= dateGetDate &&
      startGetDate <= endOfMonth(endDate).getDate()
    ) {
      if (
        startGetDateRight === 1 &&
        endGetDateRight === endOfMonth(endDateRight).getDate() &&
        getMonth(startDate, 1) > getMonth(startDateRight, 1)
      )
        return true;
      return false;
    }

    if (
      startGetDate - endGetDate === startGetDateRight - endGetDateRight &&
      getMonth(startDate, 1) > getMonth(startDateRight, 1)
    )
      return true;
    return false;
  };

  const handleOnChangeRight = (ranges) => {
    // handleOnChagneRight happens when you click on some day on Right date picker
    const { selection } = ranges;
    const rdrDays = document.querySelectorAll('.rdrDay'); // here we took all span
    if (getRightDate()) {
      rdrDays.forEach((day) =>
        day.addEventListener(
          'dblclick',
          () => handleClickRight(), // When you double click this function will work
        ),
      );
    }
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setRightDate([selection]); // here we send day
      } else if (typeDate === 'week') {
        // These checks the typeDate
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
      // These checks the typeDate
      setRightDate([selection]); // here we send day
    } else if (typeDate === 'week') {
      // These checks the typeDate
      setRightDate([
        {
          startDate: startOfWeek(selection.startDate), // here we send start of week
          endDate: endOfWeek(selection.startDate), // here we send end of week
          key: 'selection',
        },
      ]);
    }
  };

  const handleClickMonth = (e, type) => {
    e.target.addEventListener('dblclick', () => {
      if (type === 'left') {
        handleClick();
      } else if (getRightDate()) {
        handleClickRight();
      }
    });
  };

  const minDate = dayjs('2021-01-01T00:00:00.000');
  const maxDate = new Date();

  // left date picker variables
  const leftStart = new Date(left.startDate);
  const leftEnd = new Date(left.endDate);
  const leftStartBtn = new Date(leftDateBtn.startDate);
  const leftEndBtn = new Date(leftDateBtn.endDate);
  const leftStartLocal = new Date(left.startDate).toLocaleDateString();
  const leftEndLocal = new Date(left.endDate).toLocaleDateString();
  const leftBtnStartLocal = new Date(leftDateBtn.startDate).toLocaleDateString();
  const leftBtnEndLocal = new Date(leftDateBtn.endDate).toLocaleDateString();
  const leftStartGetDate = new Date(left.startDate).getDate();
  const leftEndGetDate = new Date(left.endDate).getDate();
  const leftBtnStartGetDate = new Date(leftDateBtn.startDate).getDate();
  const leftBtnEndGetDate = new Date(leftDateBtn.endDate).getDate();

  // right date picker variables
  const rightStart = new Date(right.startDate);
  const rightEnd = new Date(right.endDate);
  const rightStartLocal = new Date(right.startDate).toLocaleDateString();
  const rightEndLocal = new Date(right.endDate).toLocaleDateString();
  const rightStartGetDate = new Date(right.startDate).getDate();
  const rightEndGetDate = new Date(right.endDate).getDate();

  // planning date picker variables
  const leftStartOffers = new Date(leftDateOffers.startDate);
  const leftEndOffers = new Date(leftDateOffers.endDate);
  const leftStartLocalOffers = new Date(leftStartOffers).toLocaleDateString();
  const leftEndLocalOffers = new Date(leftEndOffers).toLocaleDateString();
  const leftStartGetDateOffers = new Date(leftStartOffers).getDate();
  const leftEndGetDateOffers = new Date(leftEndOffers).getDate();

  const getLeftDate = () => {
    if (location.pathname === '/dashboard') {
      if (titleDate === 'custom') {
        // if titleDate === "custom"  i return the date
        if (leftStartLocal === leftEndLocal) {
          return leftStartLocal;
        }
        if (leftStartGetDate === 1 && leftEndGetDate === endOfMonth(leftEnd, 1).getDate()) {
          return `${format(leftStart, 'LLL', { locale: enUS })} - ${getYear(leftStart)}`;
        }
        return `${leftStartLocal} - ${leftEndLocal}`;
      }
      return titleDate; // if titleDate !== "custom" i only return titleDate ("today", "yesterday", "current week" and etc)
    }
    if (location.pathname === '/planning') {
      if (titleOffers === 'custom') {
        // if titleDate === "custom"  i return the date
        if (leftStartLocalOffers === leftEndLocalOffers) {
          return leftStartLocalOffers;
        }
        if (
          leftStartGetDateOffers === 1 &&
          leftEndGetDateOffers === endOfMonth(leftStartOffers, 1).getDate()
        ) {
          return `${format(leftStartOffers, 'LLL', { locale: enUS })} - ${getYear(
            leftStartOffers,
          )}`;
        }
        return `${leftStartLocalOffers} - ${leftEndLocalOffers}`;
      }
      return titleOffers; // if title!== "custom" i only return title ("today", "yesterday", "current week" and etc)
    }
    if (title === 'custom') {
      // if titleDate === "custom"  i return the date
      if (leftBtnStartLocal === leftBtnEndLocal) {
        return leftBtnStartLocal;
      }
      if (leftBtnStartGetDate === 1 && leftBtnEndGetDate === endOfMonth(leftEndBtn, 1).getDate()) {
        return `${format(leftStartBtn, 'LLL', { locale: enUS })} - ${getYear(leftStartBtn)}`;
      }
      return `${leftBtnStartLocal} - ${leftBtnEndLocal}`;
    }
    return title; // if title!== "custom" i only return title ("today", "yesterday", "current week" and etc)
  };
  const getDateRight = () => {
    if (titleRightDate === 'custom') {
      // if titleRightDate === "custom"  i return the date
      if (rightStartLocal === rightEndLocal) {
        return rightStartLocal;
      }
      if (rightStartGetDate === 1 && rightEndGetDate === endOfMonth(rightEnd, 1).getDate()) {
        return `${format(rightStart, 'LLL', { locale: enUS })} - ${getYear(rightStart)}`;
      }
      return `${rightStartLocal} - ${rightEndLocal}`;
    }
    return titleRightDate; // if titleRightDate !== "custom" i only return titleRightDate ("today", "yesterday", "current week" and etc)
  };
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
            <span>{getLeftDate()}</span>
          </TypographyKit>
          <ExpandMoreIcon />
        </PaperKit>
      </div>
      <div
        role="presentation"
        tabIndex={-1}
        className={`date-range ${opened ? 'opened ' : ''}${typeDate === 'month' ? 'month' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}>
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
              onClick={(e) => handleClickMonth(e, 'left')}
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
                  <span>{getDateRight()}</span>
                </TypographyKit>
                <ExpandMoreIcon />
              </PaperKit>
              <RightDateSelect
                setRightDateBtn={setRight}
                setOpenedRight={setOpenedRight}
                setRightDate={setRightDate}
                selected={selected}
                rightDate={right}
                setTitleRight={setTitleRightDate}
                leftDate={left}
              />
            </TypographyKit>
          </div>
          <div
            role="presentation"
            tabIndex={-1}
            className={`date-range range-right ${openedRight ? 'opened' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}>
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
                        endDate:
                          getMonth(new Date()) === getMonth(new Date(newDateMonth))
                            ? new Date()
                            : endOfMonth(new Date(newDateMonth)),
                        key: 'selection',
                      },
                    ])
                  }
                  onClick={(e) => handleClickMonth(e, 'right')}
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
        role="presentation"
        tabIndex={-1}
        className={`date-range-overlay ${opened ? 'opened' : ''}`}
        onClick={() => setOpened(false)}
        onKeyDown={() => setOpened(false)}
      />
      <div
        role="presentation"
        tabIndex={-1}
        className={`date-range-overlay ${openedRight ? 'opened' : ''}`}
        onClick={() => setOpenedRight(false)}
        onKeyDown={() => setOpenedRight(false)}
      />
    </div>
  );
};

export default React.memo(Dates);
