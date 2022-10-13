import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useMemo, useState } from 'react';
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
  addMonths,
} from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS } from 'date-fns/locale';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import DatePickerKit from '../../kits/datePicker/DatePickerKit';
import ButtonKit from '../../kits/button/ButtonKit';
import useDate from '../../hooks/useDate';
import DateSelect from './DateSelect';
import CompareDateValueSelect from './CompareDateValueSelect';
import LocalizationProviderKit from '../../kits/localizationProvider/LocalizationProviderkit';
import MonthPickerKit from '../../kits/monthPicker/MonthPickerKit';
import switchIcon from '../../assets/images/Switch.png';

const Dates = (props) => {
  const { isDashboard, dateFromBtn, setdateFromBtn, isMarketingHeatMap, offer } = props;
  const {
    setDateFromContext,
    setCompareDateValueContext,
    dateFromContext,
    compareDateValueContext,
    setTitleDate,
    titleDate,
    setTitlecompareDateValue,
    titlecompareDateValue,
    typeDateContext,
    setTypeDateContext,
  } = useDate();
  const [opened, setOpened] = useState(false);
  const [openedCompareDateValue, setOpenedCompareDateValue] = useState(false);
  const [selected, setSelected] = useState(false);
  const [typeDate, setTypeDate] = useState(typeDateContext);
  const getExpanded = () => {
    if (!isMarketingHeatMap) {
      if (typeDate === 'day') {
        return 'panel1';
      }
      if (typeDate === 'week') {
        return 'panel2';
      }
      return 'panel3';
    }
    return 'panel2';
  };
  const [expanded, setExpanded] = useState(getExpanded());
  const [title, setTitle] = useState(isMarketingHeatMap ? 'current week' : titleDate);
  const [dateFrom, setdateFrom] = useState([
    {
      startDate: new Date(
        isMarketingHeatMap
          ? startOfWeek(new Date(), { weekStartsOn: 1 })
          : dateFromContext.startDate,
      ),
      endDate: new Date(isMarketingHeatMap ? new Date() : dateFromContext.endDate),
      key: 'selection',
    },
  ]);
  const [compareDateValue, setcompareDateValue] = useState([
    {
      startDate: new Date(compareDateValueContext.startDate),
      endDate: new Date(compareDateValueContext.endDate),
      key: 'selection',
    },
  ]);
  const handleClick = () => {
    // handleClick happens when you click on button "OK" on dateFromContext date picker

    // We put in variables for later use
    const startDate = new Date(dateFrom[0].startDate);
    const endDate = new Date(dateFrom[0].endDate);
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
    setOpened(false); // Closing dateFromContext date picker
    if (isDashboard) {
      setTypeDateContext(typeDate);
      // its will work on dashboard
      setDateFromContext({ startDate, endDate }); // Sending data to context state
      if (typeDate === 'day') {
        setCompareDateValueContext({
          startDate: subDays(startDate, 1),
          endDate: subDays(endDate, 1),
        }); // Sending previous day to context state
      } else if (typeDate === 'week') {
        setCompareDateValueContext({
          startDate: startOfWeek(subWeeks(startDate, 1), { weekStartsOn: 1 }),
          endDate: endOfWeek(subWeeks(endDate, 1), { weekStartsOn: 1 }),
        }); // Sending previous week to context state
      } else if (typeDate === 'month') {
        setCompareDateValueContext({
          startDate: subMonths(startDate, 1),
          endDate: endOfMonth(subMonths(endDate, 1)),
        }); // Sending previous month to context state
      }
    } else {
      // its will work on other pages
      setdateFromBtn({ startDate, endDate });
    }

    if (isDashboard) {
      // its will work on dashboard
      if (startLocal === endLocal) {
        // It checks that what date is currently selected in dateFromContext date picker
        if (startLocal === dateLocal) {
          setTitleDate('today'); // Sending data to state which will be needed for the introduction in the dateFromContext input
          setTitlecompareDateValue('yesterday'); // Sending data to state which will be needed for the introduction in the compareDateValueContext input
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setTitleDate('yesterday');
          setTitlecompareDateValue('custom');
        } else {
          setTitleDate('custom');
          setTitlecompareDateValue('custom');
        }
      } else if (
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 })
      ) {
        if (endGetDay === dateGetDay && startGetDay === 1) {
          setTitleDate('current week');
          setTitlecompareDateValue('last week');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
        ) {
          setTitleDate('last week');
          setTitlecompareDateValue('custom');
        } else {
          setTitleDate('custom');
          setTitlecompareDateValue('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
        if (startGetDate === 1 && endGetDate === dateGetDate) {
          setTitleDate('current month');
          setTitlecompareDateValue('last month');
        } else if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
          setTitleDate('last month');
          setTitlecompareDateValue('custom');
        } else {
          setTitleDate('custom');
          setTitlecompareDateValue('custom');
        }
      } else if (
        startGetDate === 1 &&
        endGetDate <= dateGetDate &&
        endGetDate === endOfMonth(endDate).getDate()
      ) {
        setTitleDate('current month');
        setTitlecompareDateValue('last month');
      } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitleDate('last month');
        setTitlecompareDateValue('custom');
      } else {
        setTitleDate('custom');
        setTitlecompareDateValue('custom');
      }
    } else if (!isDashboard) {
      // its will work on other pages
      if (startLocal === endLocal) {
        // It checks that what date is currently selected in dateFromContext date picker
        if (startLocal === dateLocal) {
          setTitle('today'); // Sending data to state which will be needed for the introduction in the dateFromContext input
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setTitle('yesterday');
        } else {
          setTitle('custom');
        }
      } else if (
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 })
      ) {
        if (offer) {
          if (
            getWeek(startDate, { weekStartsOn: 1 }) === getWeek(date, { weekStartsOn: 1 }) &&
            startGetDay === 1
          ) {
            setTitle('current week');
          } else if (
            startGetDay === 1 &&
            endGetDay === 0 &&
            getWeek(startDate, { weekStartsOn: 1 }) ===
              getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
          ) {
            setTitle('last week');
          } else {
            setTitle('custom');
          }
        } else if (endGetDay === dateGetDay && startGetDay === 1) {
          setTitle('current week');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
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
  const handleClickCompareDateValue = () => {
    // handleClickCompareDateValue happens when you click on button "OK" on CompareDateValue date picker

    // We put in variables for later use
    const startDate = new Date(compareDateValue[0].startDate);
    const endDate = new Date(compareDateValue[0].endDate);
    const date = new Date();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDate = date.getDate();
    setOpenedCompareDateValue(false); // Closing CompareDateValue date picker
    setSelected(false); // Closing CompareDateValue Select
    setCompareDateValueContext({ startDate, endDate }); // Sending data to context state

    if (startLocal === endLocal) {
      // It checks that what date is currently selected in CompareDateValue date picker

      // Sending data to state which will be needed for the introduction in the compareDateValueContext input
      if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitlecompareDateValue('yesterday');
      } else {
        setTitlecompareDateValue('custom');
      }
    } else if (getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 })) {
      if (
        startGetDay === 1 &&
        endGetDay === 0 &&
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
      ) {
        setTitlecompareDateValue('last week');
      } else {
        setTitlecompareDateValue('custom');
      }
    } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
      if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitlecompareDateValue('last month');
      } else {
        setTitlecompareDateValue('custom');
      }
    } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
      setTitlecompareDateValue('last month');
    } else {
      setTitlecompareDateValue('custom');
    }
  };
  useMemo(() => {
    localStorage.setItem(
      'date',
      JSON.stringify({
        titleDate,
        titlecompareDateValue,
        dateFromBtn,
        dateFrom: {
          startDate: new Date(dateFromContext.startDate),
          endDate: new Date(dateFromContext.endDate),
        },
        compareDateValue: {
          startDate: new Date(compareDateValueContext.startDate),
          endDate: new Date(compareDateValueContext.endDate),
        },
        typeDate: typeDateContext,
      }),
    );
  }, [
    titleDate,
    titlecompareDateValue,
    dateFromBtn,
    dateFromContext,
    compareDateValueContext,
    typeDateContext,
  ]);
  const handleOnChange = (ranges) => {
    // handleOnChagne happens when you click on some day on dateFromContext date picker
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setdateFrom([selection]); // here we send day
      } else if (typeDate === 'week') {
        const getOfferWeek = () => {
          if (offer) {
            return endOfWeek(selection.startDate, { weekStartsOn: 1 });
          }

          if (
            getWeek(new Date(), { weekStartsOn: 1 }) ===
            getWeek(selection.startDate, { weekStartsOn: 1 })
          ) {
            return new Date();
          }
          return endOfWeek(selection.startDate, { weekStartsOn: 1 });
        };
        // These checks the typeDate
        setdateFrom([
          {
            startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we send start of week
            endDate: getOfferWeek(),
            key: 'selection',
          },
        ]);
      }
    } else if (typeDate === 'day') {
      // These checks the typeDate
      setdateFrom([selection]); // here we send day
    } else if (typeDate === 'week') {
      // These checks the typeDate
      setdateFrom([
        {
          startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(selection.startDate, { weekStartsOn: 1 }),
          key: 'selection',
        },
      ]);
    }
  };
  const getcompareDateValue = () => {
    // This function should check if the date of the dateFromContext date is the same as the date of the compareDateValueContext date

    // We put in variables for later use
    const date = new Date();
    const startDate = new Date(dateFromContext.startDate);
    const endDate = new Date(dateFromContext.endDate);
    const startDateCompareDateValue = new Date(compareDateValue[0].startDate);
    const endDateCompareDateValue = new Date(compareDateValue[0].endDate);
    const startLocalCompareDateValue = startDateCompareDateValue.toLocaleDateString();
    const endLocalCompareDateValue = endDateCompareDateValue.toLocaleDateString();
    const startGetDateCompareDateValue = startDateCompareDateValue.getDate();
    const endGetDateCompareDateValue = endDateCompareDateValue.getDate();
    const startGetDayCompareDateValue = startDateCompareDateValue.getDay();
    const endGetDayCompareDateValue = endDateCompareDateValue.getDay();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();

    // This comparison needed for compareDateValueContext date picker button, check if dateFromContext date picker not more then chosed date and have the same type
    if (getMonth(startDateCompareDateValue) === getMonth(date)) {
      // check if month of clicked date equal with today`s month
      if (startLocal === endLocal) {
        if (
          startLocalCompareDateValue === endLocalCompareDateValue &&
          startLocal > startLocalCompareDateValue
        )
          return true;
        return false;
      }
      if (
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(endDate, { weekStartsOn: 1 }) &&
        startGetDay === 1 &&
        endGetDay === dateGetDay
      ) {
        if (
          startGetDayCompareDateValue === 1 &&
          endGetDayCompareDateValue === 0 &&
          getWeek(date, { weekStartsOn: 1 }) !==
            getWeek(startDateCompareDateValue, { weekStartsOn: 1 }) &&
          getWeek(startDateCompareDateValue, { weekStartsOn: 1 }) ===
            getWeek(endDateCompareDateValue, { weekStartsOn: 1 })
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
          startGetDateCompareDateValue === 1 &&
          endGetDateCompareDateValue >= dateGetDate &&
          startGetDateCompareDateValue <= lastDayOfMonth(endDateCompareDateValue).getDate() &&
          getMonth(startDate, 1) > getMonth(startDateCompareDateValue, 1)
        )
          return true;
        return false;
      }

      if (startGetDate - endGetDate === startGetDateCompareDateValue - endGetDateCompareDateValue)
        return true;
      return false;
    }

    if (typeDate === 'week') {
      if (
        startGetDayCompareDateValue === 1 &&
        endGetDayCompareDateValue === 0 &&
        getWeek(startDateCompareDateValue, { weekStartsOn: 1 }) <
          getWeek(startDate, { weekStartsOn: 1 })
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
        startGetDateCompareDateValue === 1 &&
        endGetDateCompareDateValue === endOfMonth(endDateCompareDateValue).getDate() &&
        getMonth(startDate, 1) > getMonth(startDateCompareDateValue, 1)
      )
        return true;
      return false;
    }

    if (
      startGetDate - endGetDate === startGetDateCompareDateValue - endGetDateCompareDateValue &&
      getMonth(startDate, 1) > getMonth(startDateCompareDateValue, 1)
    )
      return true;
    return false;
  };

  const handleOnChangeCompareDateValue = (ranges) => {
    // handleOnChagneCompareDateValue happens when you click on some day on CompareDateValue date picker
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      // This will check if today's month is equal to the month of the clicked day
      if (typeDate === 'day') {
        // These checks the typeDate
        setcompareDateValue([selection]); // here we send day
      } else if (typeDate === 'week') {
        // These checks the typeDate
        setcompareDateValue([
          {
            startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we send start of week
            endDate:
              getWeek(new Date(), { weekStartsOn: 1 }) ===
              getWeek(selection.startDate, { weekStartsOn: 1 })
                ? new Date()
                : endOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we compare if the week of today is equal to the week of the clicked day
            key: 'selection',
          },
        ]);
      }
    } else if (typeDate === 'day') {
      // These checks the typeDate
      setcompareDateValue([selection]); // here we send day
    } else if (typeDate === 'week') {
      // These checks the typeDate
      setcompareDateValue([
        {
          startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we send start of week
          endDate: endOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we send end of week
          key: 'selection',
        },
      ]);
    }
  };

  const minDate = dayjs('2021-01-01T00:00:00.000');
  const maxDate = new Date();

  // dateFromContext date picker variables
  const dateFromContextStart = new Date(dateFromContext.startDate);
  const dateFromContextEnd = new Date(dateFromContext.endDate);
  const dateFromContextStartBtn = new Date(dateFromBtn?.startDate);
  const dateFromContextEndBtn = new Date(dateFromBtn?.endDate);
  const dateFromContextStartLocal = new Date(dateFromContext.startDate).toLocaleDateString();
  const dateFromContextEndLocal = new Date(dateFromContext.endDate).toLocaleDateString();
  const dateFromContextBtnStartLocal = new Date(dateFromBtn?.startDate).toLocaleDateString();
  const dateFromContextBtnEndLocal = new Date(dateFromBtn?.endDate).toLocaleDateString();
  const dateFromContextStartGetDate = new Date(dateFromContext.startDate).getDate();
  const dateFromContextEndGetDate = new Date(dateFromContext.endDate).getDate();
  const dateFromContextBtnStartGetDate = new Date(dateFromBtn?.startDate).getDate();
  const dateFromContextBtnEndGetDate = new Date(dateFromBtn?.endDate).getDate();

  // compareDateValueContext date picker variables
  const compareDateValueContextStart = new Date(compareDateValueContext.startDate);
  const compareDateValueContextEnd = new Date(compareDateValueContext.endDate);
  const compareDateValueContextStartLocal = new Date(
    compareDateValueContext.startDate,
  ).toLocaleDateString();
  const compareDateValueContextEndLocal = new Date(
    compareDateValueContext.endDate,
  ).toLocaleDateString();
  const compareDateValueContextStartGetDate = new Date(compareDateValueContext.startDate).getDate();
  const compareDateValueContextEndGetDate = new Date(compareDateValueContext.endDate).getDate();

  const getdateFrom = () => {
    if (isDashboard) {
      if (titleDate === 'custom') {
        // if titleDate === "custom"  i return the date
        if (dateFromContextStartLocal === dateFromContextEndLocal) {
          return dateFromContextStartLocal;
        }
        if (
          dateFromContextStartGetDate === 1 &&
          dateFromContextEndGetDate === endOfMonth(dateFromContextEnd, 1).getDate()
        ) {
          return `${format(dateFromContextStart, 'LLL', { locale: enUS })} - ${getYear(
            dateFromContextStart,
          )}`;
        }
        return `${dateFromContextStartLocal} - ${dateFromContextEndLocal}`;
      }
      return titleDate; // if titleDate !== "custom" i only return titleDate ("today", "yesterday", "current week" and etc)
    }
    if (title === 'custom') {
      // if titleDate === "custom"  i return the date
      if (dateFromContextBtnStartLocal === dateFromContextBtnEndLocal) {
        return dateFromContextBtnStartLocal;
      }
      if (
        dateFromContextBtnStartGetDate === 1 &&
        dateFromContextBtnEndGetDate === endOfMonth(dateFromContextEndBtn, 1).getDate()
      ) {
        return `${format(dateFromContextStartBtn, 'LLL', { locale: enUS })} - ${getYear(
          dateFromContextStartBtn,
        )}`;
      }
      return `${dateFromContextBtnStartLocal} - ${dateFromContextBtnEndLocal}`;
    }
    return title; // if title!== "custom" i only return title ("today", "yesterday", "current week" and etc)
  };
  const getDateCompareDateValue = () => {
    if (titlecompareDateValue === 'custom') {
      // if titlecompareDateValue === "custom"  i return the date
      if (compareDateValueContextStartLocal === compareDateValueContextEndLocal) {
        return compareDateValueContextStartLocal;
      }
      if (
        compareDateValueContextStartGetDate === 1 &&
        compareDateValueContextEndGetDate === endOfMonth(compareDateValueContextEnd, 1).getDate()
      ) {
        return `${format(compareDateValueContextStart, 'LLL', { locale: enUS })} - ${getYear(
          compareDateValueContextStart,
        )}`;
      }
      return `${compareDateValueContextStartLocal} - ${compareDateValueContextEndLocal}`;
    }
    return titlecompareDateValue; // if titlecompareDateValue !== "custom" i only return titlecompareDateValue ("today", "yesterday", "current week" and etc)
  };
  const getMarketingHeatMap = () => {
    if (isMarketingHeatMap) {
      return (
        <DatePickerKit
          onRangeFocusChange={(e) => e}
          minDate={new Date(minDate)}
          maxDate={offer ? new Date(addMonths(maxDate, 1)) : maxDate}
          onChange={handleOnChange}
          showSelectionPreview
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={dateFrom}
          direction="horizontal"
          dragSelectionEnabled={false}
          weekStartsOn={1}
        />
      );
    }
    return typeDate === 'month' ? (
      <LocalizationProviderKit dateAdapter={AdapterDayjs}>
        <MonthPickerKit
          className="month_picker"
          date={dayjs(dateFrom[0].startDate)}
          minDate={minDate}
          maxDate={offer ? new Date(addMonths(maxDate, 1)) : maxDate}
          onChange={(newDateMonth) =>
            setdateFrom([
              {
                startDate: startOfMonth(new Date(newDateMonth)),
                endDate:
                  getMonth(new Date(newDateMonth)) === getMonth(new Date())
                    ? new Date()
                    : endOfMonth(new Date(newDateMonth)),
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
        maxDate={offer ? new Date(addMonths(maxDate, 1)) : maxDate}
        onChange={handleOnChange}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={dateFrom}
        direction="horizontal"
        dragSelectionEnabled={false}
        weekStartsOn={1}
      />
    );
  };
  return (
    <div className="dates">
      <div className="date-picker_wrapper">
        <TypographyKit className="top-text-inputs" variant="subtitle">
          Show Data from
        </TypographyKit>
        <PaperKit
          onClick={() => setOpened(true)}
          style={{ background: '#fff' }}
          component="div"
          className="date-input">
          <TypographyKit className="date-typography">
            <CalendarMonthIcon />
            <span>{getdateFrom()}</span>
          </TypographyKit>
          <ExpandMoreIcon className={`expand-img ${opened ? 'active' : ''}`} />
        </PaperKit>
      </div>
      <div
        role="presentation"
        tabIndex={-1}
        className={`date-range ${opened ? 'opened ' : ''}${typeDate === 'month' ? 'month' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}>
        <PaperKit style={{ background: '#fff' }} className="date-picker">
          {!isMarketingHeatMap ? (
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index="1"
              type="day"
              setSelections={setdateFrom}
              setTypeDate={setTypeDate}
              dateFrom={dateFrom}
            />
          ) : (
            ''
          )}
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index="2"
            type="week"
            setSelections={setdateFrom}
            setTypeDate={setTypeDate}
            dateFrom={dateFrom}
          />
          {!isMarketingHeatMap ? (
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index="3"
              type="month"
              setSelections={setdateFrom}
              setTypeDate={setTypeDate}
              dateFrom={dateFrom}
            />
          ) : (
            ''
          )}
          <div className="date-btn-wrapper">
            <ButtonKit onClick={handleClick} className="date-save-btn " variant="contained">
              Ok
            </ButtonKit>
          </div>
        </PaperKit>
        {getMarketingHeatMap()}
      </div>
      {!isMarketingHeatMap ? (
        <div className="dashboard-date ">
          <img src={switchIcon} alt="Compare" />
          <div className={`date-picker_wrapper ${!isDashboard ? 'disabled' : ''}`}>
            <TypographyKit className="top-text-inputs" variant="subtitle">
              Compare to
            </TypographyKit>
            <TypographyKit component="div" className="date-input-wrapper">
              <PaperKit
                style={{ background: '#fff' }}
                onClick={() => setSelected(isDashboard ? !selected : false)}
                className={`date-input ${selected ? 'selected' : ''}`}>
                <TypographyKit component="div" className="date-typography">
                  <CalendarMonthIcon />
                  <span>{getDateCompareDateValue()}</span>
                </TypographyKit>
                <ExpandMoreIcon className={`expand-img ${selected ? 'active' : ''}`} />
              </PaperKit>
              <CompareDateValueSelect
                setcompareDateValueBtn={setCompareDateValueContext}
                setOpenedCompareDateValue={setOpenedCompareDateValue}
                setcompareDateValue={setcompareDateValue}
                selected={selected}
                compareDateValue={compareDateValueContext}
                setTitleCompareDateValue={setTitlecompareDateValue}
                dateFrom={dateFromContext}
                titledateFromContext={titleDate}
                typeDate={typeDate}
                setSelected={setSelected}
              />
            </TypographyKit>
          </div>
          <div
            role="presentation"
            tabIndex={-1}
            className={`date-range range-compareDateValueContext ${
              openedCompareDateValue ? 'opened' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}>
            <PaperKit style={{ background: '#fff' }} className="date-picker">
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="1"
                type="day"
                setSelections={setcompareDateValue}
                setTypeDate={setTypeDate}
                dateFrom={compareDateValue}
              />
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="2"
                type="week"
                setSelections={setcompareDateValue}
                setTypeDate={setTypeDate}
                dateFrom={compareDateValue}
              />
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="3"
                type="month"
                setSelections={setcompareDateValue}
                setTypeDate={setTypeDate}
                dateFrom={compareDateValue}
              />
              <div className="date-btn-wrapper">
                <ButtonKit
                  disabled={!getcompareDateValue()}
                  onClick={handleClickCompareDateValue}
                  className={`date-save-btn ${getcompareDateValue() ? '' : 'date-disabled-btn'}`}
                  variant="contained">
                  Ok
                </ButtonKit>
              </div>
            </PaperKit>
            {typeDate === 'month' ? (
              <LocalizationProviderKit dateAdapter={AdapterDayjs}>
                <MonthPickerKit
                  className="month_picker"
                  date={dayjs(compareDateValue[0].startDate)}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newDateMonth) =>
                    setcompareDateValue([
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
                />
              </LocalizationProviderKit>
            ) : (
              <DatePickerKit
                onRangeFocusChange={(e) => e}
                minDate={new Date(minDate)}
                maxDate={new Date()}
                onChange={handleOnChangeCompareDateValue}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={compareDateValue}
                direction="horizontal"
                dragSelectionEnabled={false}
                weekStartsOn={1}
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
        className={`date-range-overlay ${openedCompareDateValue ? 'opened' : ''}`}
        onClick={() => setOpenedCompareDateValue(false)}
        onKeyDown={() => setOpenedCompareDateValue(false)}
      />
      <div
        role="presentation"
        tabIndex={-1}
        className={`date-range-overlay ${selected ? 'opened' : ''}`}
        onClick={() => setSelected(false)}
        onKeyDown={() => setSelected(false)}
      />
    </div>
  );
};

export default React.memo(Dates);
