import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useEffect, useState } from 'react';
import {
  endOfMonth,
  endOfWeek,
  getWeek,
  getMonth,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
  format,
  getYear,
  addMonths,
  addYears,
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
import AfterPeriodSelect from './AfterPeriodSelect';
import LocalizationProviderKit from '../../kits/localizationProvider/LocalizationProviderkit';
import MonthPickerKit from '../../kits/monthPicker/MonthPickerKit';
import switchIcon from '../../assets/images/Switch.png';
import { getAllDateSetup } from '../../utlls/date/getAllDateSetup';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import SelectKit from '../../kits/select/SelectKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';

const Dates = (props) => {
  const {
    isDashboard,
    beforePeriodBtn,
    setbeforePeriodBtn,
    isMarketingHeatMap,
    offer,
    defaultTypeDate,
    defaultTitle,
    setupOffer,
  } = props;
  const { date: dateContext, setDate: setDateContext } = useDate();
  const {
    beforePeriod: beforePeriodDateContext,
    afterPeriod: afterPeriodDateContext,
    titleDate: titleDateContext,
    titleafterPeriod: titleafterPeriodContext,
    typeDate: typeDateContext,
  } = dateContext;
  const [opened, setOpened] = useState(false);
  const [openedAfterPeriod, setOpenedAfterPeriod] = useState(false);
  const [selected, setSelected] = useState(false);
  const [typeDate, setTypeDate] = useState(defaultTypeDate || typeDateContext);
  const [titleDate, setTitleDate] = useState(titleDateContext);
  const [titleafterPeriod, setTitleafterPeriod] = useState(titleafterPeriodContext);
  const [afterPeriodContext, setAfterPeriodContext] = useState(afterPeriodDateContext);
  const [beforePeriodContext, setBeforePeriodContext] = useState(beforePeriodDateContext);
  const [year, setYear] = useState(new Date(beforePeriodContext.startDate).getFullYear());
  const [yearAfterPeriod, setYearAfterPeriod] = useState(
    new Date(afterPeriodContext.startDate).getFullYear(),
  );
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
  const [title, setTitle] = useState(defaultTitle || titleDateContext);
  const [beforePeriod, setbeforePeriod] = useState([
    {
      startDate: new Date(
        beforePeriodBtn ? beforePeriodBtn.startDate : beforePeriodContext.startDate,
      ),
      endDate: new Date(beforePeriodBtn ? beforePeriodBtn.endDate : beforePeriodContext.endDate),
      key: 'selection',
    },
  ]);
  const [afterPeriod, setafterPeriod] = useState([
    {
      startDate: new Date(afterPeriodContext.startDate),
      endDate: new Date(afterPeriodContext.endDate),
      key: 'selection',
    },
  ]);

  const minDate = dayjs('2021-01-01T00:00:00.000');
  const maxDate = new Date();

  // beforePeriodContext date picker variables
  const beforePeriodContextStart = new Date(beforePeriodContext.startDate);
  const beforePeriodContextEnd = new Date(beforePeriodContext.endDate);
  const beforePeriodContextStartLocal = new Date(
    beforePeriodContext.startDate,
  ).toLocaleDateString();
  const beforePeriodContextEndLocal = new Date(beforePeriodContext.endDate).toLocaleDateString();
  const beforePeriodContextStartGetDate = new Date(beforePeriodContext.startDate).getDate();
  const beforePeriodContextEndGetDate = new Date(beforePeriodContext.endDate).getDate();

  // beforePeriodContextBtn date picker variables
  const beforePeriodContextStartBtn = new Date(beforePeriodBtn?.startDate);
  const beforePeriodContextEndBtn = new Date(beforePeriodBtn?.endDate);
  const beforePeriodContextBtnStartLocal = new Date(
    beforePeriodBtn?.startDate,
  ).toLocaleDateString();
  const beforePeriodContextBtnEndLocal = new Date(beforePeriodBtn?.endDate).toLocaleDateString();
  const beforePeriodContextBtnStartGetDate = new Date(beforePeriodBtn?.startDate).getDate();
  const beforePeriodContextBtnEndGetDate = new Date(beforePeriodBtn?.endDate).getDate();

  // afterPeriodContext date picker variables
  const afterPeriodContextStart = new Date(afterPeriodContext.startDate);
  const afterPeriodContextEnd = new Date(afterPeriodContext.endDate);
  const afterPeriodContextStartLocal = new Date(afterPeriodContext.startDate).toLocaleDateString();
  const afterPeriodContextEndLocal = new Date(afterPeriodContext.endDate).toLocaleDateString();
  const afterPeriodContextStartGetDate = new Date(afterPeriodContext.startDate).getDate();
  const afterPeriodContextEndGetDate = new Date(afterPeriodContext.endDate).getDate();

  useEffect(() => {
    localStorage.setItem(
      'date',
      JSON.stringify({
        titleDate,
        titleafterPeriod,
        beforePeriodBtn,
        beforePeriod: {
          startDate: new Date(beforePeriodContext.startDate),
          endDate: new Date(beforePeriodContext.endDate),
        },
        afterPeriod: {
          startDate: new Date(afterPeriodContext.startDate),
          endDate: new Date(afterPeriodContext.endDate),
        },
        typeDate: typeDateContext,
      }),
    );
  }, [
    titleDate,
    titleafterPeriod,
    beforePeriodBtn,
    beforePeriodContext,
    afterPeriodContext,
    typeDateContext,
  ]);
  const handleClickDashboard = () => {
    const startDate =
      typeDate === 'month'
        ? new Date(beforePeriod[0].startDate).setFullYear(year)
        : new Date(beforePeriod[0].startDate);
    const endDate =
      typeDate === 'month'
        ? new Date(beforePeriod[0].endDate).setFullYear(year)
        : new Date(beforePeriod[0].endDate);
    const date = new Date();

    const { startLocal, startGetDay, endGetDay, dateGetDay, dateLocal } = getAllDateSetup(
      startDate,
      endDate,
    );

    if (typeDate === 'day') {
      setAfterPeriodContext({
        startDate: subDays(startDate, 1),
        endDate: subDays(endDate, 1),
      });
      setBeforePeriodContext({ startDate, endDate });
      // It checks that what date is currently selected in beforePeriodContext date picker
      if (startLocal === dateLocal) {
        setTitleDate('today'); // Sending data to state which will be needed for the introduction in the beforePeriodContext input
        setTitleafterPeriod('yesterday'); // Sending data to state which will be needed for the introduction in the afterPeriodContext input
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subDays(startDate, 1),
            endDate: subDays(endDate, 1),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'today',
          titleafterPeriod: 'yesterday',
        });
        return;
      }

      if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitleDate('yesterday');
        setTitleafterPeriod('day before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subDays(startDate, 1),
            endDate: subDays(endDate, 1),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'yesterday',
          titleafterPeriod: 'day before',
        });
        return;
      }
      setTitleDate('custom');
      setTitleafterPeriod('day before');
      setDateContext({
        ...dateContext,
        afterPeriod: {
          startDate: subDays(startDate, 1),
          endDate: subDays(endDate, 1),
        },
        beforePeriod: { startDate, endDate },
        typeDate,
        titleDate: 'custom',
        titleafterPeriod: 'day before',
      });
      return;
    }

    if (typeDate === 'week') {
      setAfterPeriodContext({
        startDate: startOfWeek(subWeeks(startDate, 1), { weekStartsOn: 1 }),
        endDate: endOfWeek(subWeeks(endDate, 1), { weekStartsOn: 1 }),
      });
      setBeforePeriodContext({ startDate, endDate });
      if (endGetDay === dateGetDay && startGetDay === 1) {
        setTitleDate('current week');
        setTitleafterPeriod('last week');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: startOfWeek(subWeeks(startDate, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(endDate, 1), { weekStartsOn: 1 }),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'current week',
          titleafterPeriod: 'last week',
        });
        return;
      }

      if (
        startGetDay === 1 &&
        endGetDay === 0 &&
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
      ) {
        setTitleDate('last week');
        setTitleafterPeriod('week before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: startOfWeek(subWeeks(startDate, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(endDate, 1), { weekStartsOn: 1 }),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'last week',
          titleafterPeriod: 'week before',
        });
        return;
      }

      setTitleDate('custom');
      setTitleafterPeriod('week before');
      setDateContext({
        ...dateContext,
        afterPeriod: {
          startDate: startOfWeek(subWeeks(startDate, 1), { weekStartsOn: 1 }),
          endDate: endOfWeek(subWeeks(endDate, 1), { weekStartsOn: 1 }),
        },
        beforePeriod: { startDate, endDate },
        typeDate,
        titleDate: 'custom',
        titleafterPeriod: 'week before',
      });
      return;
    }
    if (typeDate === 'month') {
      setAfterPeriodContext({
        startDate: subMonths(startDate, 1),
        endDate: endOfMonth(subMonths(endDate, 1)),
      });
      setBeforePeriodContext({ startDate, endDate });
      if (getMonth(startDate) === getMonth(date)) {
        setTitleDate('current month');
        setTitleafterPeriod('last month');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subMonths(startDate, 1),
            endDate: endOfMonth(subMonths(endDate, 1)),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'current month',
          titleafterPeriod: 'last month',
        });
        return;
      }
      if (getMonth(startDate) === getMonth(subMonths(date, 1))) {
        setTitleDate('last month');
        setTitleafterPeriod('month before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subMonths(startDate, 1),
            endDate: endOfMonth(subMonths(endDate, 1)),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'last month',
          titleafterPeriod: 'month before',
        });
      } else {
        setTitleDate('custom');
        setTitleafterPeriod('month before');
        setDateContext({
          ...dateContext,
          afterPeriod: {
            startDate: subMonths(startDate, 1),
            endDate: endOfMonth(subMonths(endDate, 1)),
          },
          beforePeriod: { startDate, endDate },
          typeDate,
          titleDate: 'custom',
          titleafterPeriod: 'month before',
        });
      }
    }
  };

  const handleClick = () => {
    setOpened(false); // Closing beforePeriodContext date picker
    if (isDashboard) {
      handleClickDashboard();
      return;
    }

    const startDate = new Date(beforePeriod[0].startDate);
    const endDate = new Date(beforePeriod[0].endDate);
    const date = new Date();

    const { startLocal, startGetDay, endGetDay, dateGetDay, dateLocal } = getAllDateSetup(
      beforePeriod[0].startDate,
      beforePeriod[0].endDate,
    );
    if (typeDate === 'month') {
      setbeforePeriodBtn({
        startDate: new Date(startDate).setFullYear(year),
        endDate: new Date(endDate).setFullYear(year),
      });
    } else {
      setbeforePeriodBtn({ startDate, endDate });
    }

    if (typeDate === 'day') {
      if (startLocal === dateLocal) {
        setTitle('today');
        return;
      }

      if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitle('yesterday');
        return;
      }

      setTitle('custom');
      return;
    }

    if (typeDate === 'week') {
      if (offer) {
        if (
          getWeek(startDate, { weekStartsOn: 1 }) === getWeek(date, { weekStartsOn: 1 }) &&
          startGetDay === 1
        ) {
          setTitle('current week');
          return;
        }

        if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
        ) {
          setTitle('last week');
          return;
        }

        setTitle('custom');
        return;
      }

      if (endGetDay === dateGetDay && startGetDay === 1) {
        setTitle('current week');
        return;
      }

      if (
        startGetDay === 1 &&
        endGetDay === 0 &&
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
      ) {
        setTitle('last week');
        return;
      }

      setTitle('custom');
      return;
    }

    if (getMonth(startDate) === getMonth(date)) {
      setTitle('current month');
      return;
    }

    if (getMonth(startDate) === getMonth(subMonths(date, 1))) {
      setTitle('last month');
      return;
    }

    setTitle('custom');
  };
  const handleClickAfterPeriod = () => {
    // handleClickAfterPeriod happens when you click on button "OK" on AfterPeriod date picker

    // We put in variables for later use
    const startDate =
      typeDate === 'month'
        ? new Date(afterPeriod[0].startDate).setFullYear(yearAfterPeriod)
        : new Date(afterPeriod[0].startDate);
    const endDate =
      typeDate === 'month'
        ? new Date(afterPeriod[0].endDate).setFullYear(yearAfterPeriod)
        : new Date(afterPeriod[0].endDate);
    const startDateBeforePeriod = new Date(beforePeriodContext.startDate);
    const date = new Date();
    const { startLocal, startGetDate, endGetDate, startGetDay, dateGetDate } = getAllDateSetup(
      afterPeriod[0].startDate,
      afterPeriod[0].endDate,
    );

    setOpenedAfterPeriod(false);
    setSelected(false);
    setAfterPeriodContext({ startDate, endDate });

    if (typeDate === 'day') {
      if (startLocal === subDays(date, 1).toLocaleDateString()) {
        setTitleafterPeriod('yesterday');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'yesterday',
        });
        return;
      }
      if (startLocal === new Date(subDays(startDateBeforePeriod, 1)).toLocaleDateString()) {
        setTitleafterPeriod('day before');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'day before',
        });
        return;
      }
      if (startGetDay === new Date(subWeeks(startDateBeforePeriod, 1)).getDay()) {
        setTitleafterPeriod('same day last week');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'same day last week',
        });
        return;
      }
      setTitleafterPeriod('custom');
      setDateContext({
        ...dateContext,
        afterPeriod: { startDate, endDate },
        titleafterPeriod: 'custom',
      });
      return;
    }
    if (typeDate === 'week') {
      if (
        getWeek(startDate, { weekStartsOn: 1 }) === getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
      ) {
        setTitleafterPeriod('last week');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'last week',
        });
        return;
      }
      if (
        getWeek(startDate, { weekStartsOn: 1 }) ===
        getWeek(subWeeks(startDateBeforePeriod, 1), { weekStartsOn: 1 })
      ) {
        setTitleafterPeriod('week before');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'week before',
        });
        return;
      }
      setTitleafterPeriod('custom');
      setDateContext({
        ...dateContext,
        afterPeriod: { startDate, endDate },
        titleafterPeriod: 'custom',
      });
      return;
    }

    if (typeDate === 'month') {
      if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitleafterPeriod('last month');
        setDateContext({
          ...dateContext,
          afterPeriod: { startDate, endDate },
          titleafterPeriod: 'last month',
        });
        return;
      }

      setTitleafterPeriod('custom');
      setDateContext({
        ...dateContext,
        afterPeriod: { startDate, endDate },
        titleafterPeriod: 'custom',
      });
    }

    if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
      setTitleafterPeriod('last month');
      setDateContext({
        ...dateContext,
        afterPeriod: { startDate, endDate },
        titleafterPeriod: 'last month',
      });

      return;
    }

    setTitleafterPeriod('custom');
    setDateContext({
      ...dateContext,
      afterPeriod: { startDate, endDate },
      titleafterPeriod: 'custom',
    });
  };

  const handleOnChange = (ranges) => {
    const { selection } = ranges;

    if (getMonth(selection.startDate) === getMonth(new Date())) {
      if (typeDate === 'day') {
        // These checks the typeDate
        setbeforePeriod([selection]);
        return;
      }

      if (typeDate === 'week') {
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

        setbeforePeriod([
          {
            startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }), // here we send start of week
            endDate: getOfferWeek(),
            key: 'selection',
          },
        ]);

        return;
      }
    }

    if (typeDate === 'day') {
      // These checks the typeDate
      setbeforePeriod([selection]);
      return;
    }

    setbeforePeriod([
      {
        startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }),
        endDate: endOfWeek(selection.startDate, { weekStartsOn: 1 }),
        key: 'selection',
      },
    ]);
  };
  const getafterPeriod = () => {
    const startDateAfterPeriod = new Date(afterPeriod[0].startDate);
    const startLocalAfterPeriod = startDateAfterPeriod.toLocaleDateString();

    if (typeDate === 'day') {
      return startLocalAfterPeriod < beforePeriodContextStartLocal;
    }

    if (typeDate === 'week') {
      return (
        getWeek(startDateAfterPeriod, { weekStartsOn: 1 }) <
        getWeek(beforePeriodContextStart, { weekStartsOn: 1 })
      );
    }

    if (typeDate === 'month') {
      if (
        getYear(new Date(startDateAfterPeriod).setFullYear(yearAfterPeriod)) <=
        getYear(new Date(beforePeriodContextStart).setFullYear(year))
      ) {
        return (
          getMonth(new Date(startDateAfterPeriod).setFullYear(yearAfterPeriod)) <
          getMonth(new Date(beforePeriodContextStart).setFullYear(year))
        );
      }
      return false;
    }

    return false;
  };

  const handleOnChangeAfterPeriod = (ranges) => {
    const { selection } = ranges;

    if (typeDate === 'day') {
      setafterPeriod([selection]);
      return;
    }

    if (getMonth(selection.startDate) === getMonth(new Date())) {
      if (typeDate === 'week') {
        setafterPeriod([
          {
            startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }),
            endDate:
              getWeek(new Date(), { weekStartsOn: 1 }) ===
              getWeek(selection.startDate, { weekStartsOn: 1 })
                ? new Date()
                : endOfWeek(selection.startDate, { weekStartsOn: 1 }),
            key: 'selection',
          },
        ]);
        return;
      }
    }

    setafterPeriod([
      {
        startDate: startOfWeek(selection.startDate, { weekStartsOn: 1 }),
        endDate: endOfWeek(selection.startDate, { weekStartsOn: 1 }),
        key: 'selection',
      },
    ]);
  };

  const getbeforePeriodDashboard = () => {
    if (titleDate === 'custom') {
      // if titleDate === "custom"  i return the date
      if (beforePeriodContextStartLocal === beforePeriodContextEndLocal) {
        return beforePeriodContextStartLocal;
      }
      if (
        beforePeriodContextStartGetDate === 1 &&
        beforePeriodContextEndGetDate === endOfMonth(beforePeriodContextEnd, 1).getDate()
      ) {
        return `${format(beforePeriodContextStart, 'LLL', { locale: enUS })} - ${getYear(
          beforePeriodContextStart,
        )}`;
      }
      return `${beforePeriodContextStartLocal} - ${beforePeriodContextEndLocal}`;
    }
    return titleDate;
  };

  const getbeforePeriod = () => {
    if (isDashboard) {
      return getbeforePeriodDashboard();
    }

    if (title === 'custom') {
      if (beforePeriodContextBtnStartLocal === beforePeriodContextBtnEndLocal) {
        return beforePeriodContextBtnStartLocal;
      }
      if (
        beforePeriodContextBtnStartGetDate === 1 &&
        beforePeriodContextBtnEndGetDate === endOfMonth(beforePeriodContextEndBtn, 1).getDate()
      ) {
        return `${format(beforePeriodContextStartBtn, 'LLL', { locale: enUS })} - ${getYear(
          beforePeriodContextStartBtn,
        )}`;
      }
      return `${beforePeriodContextBtnStartLocal} - ${beforePeriodContextBtnEndLocal}`;
    }
    return title;
  };

  const getDateAfterPeriod = () => {
    if (titleafterPeriod !== 'custom') {
      return titleafterPeriod;
    }

    if (afterPeriodContextStartLocal === afterPeriodContextEndLocal) {
      return afterPeriodContextStartLocal;
    }

    if (
      afterPeriodContextStartGetDate === 1 &&
      afterPeriodContextEndGetDate === endOfMonth(afterPeriodContextEnd, 1).getDate()
    ) {
      return `${format(afterPeriodContextStart, 'LLL', { locale: enUS })} - ${getYear(
        afterPeriodContextStart,
      )}`;
    }

    return `${afterPeriodContextStartLocal} - ${afterPeriodContextEndLocal}`;
  };
  const [yearArr, setYearArr] = useState([]);

  useEffect(() => {
    const yearStart = 2021;
    const yearEnd = offer
      ? new Date(addMonths(maxDate, 1)).getFullYear()
      : new Date().getFullYear();
    const arr = [];

    for (let i = yearStart; i <= yearEnd; i++) {
      arr.push(i);
    }
    setYearArr(arr);
  }, []);

  const handleChangeYear = (event) => {
    setYear(event.target.value);
    setbeforePeriod([
      {
        startDate: startOfMonth(new Date(new Date().setMonth(0)).setFullYear(event.target.value)),
        endDate: endOfMonth(new Date(new Date().setMonth(0)).setFullYear(event.target.value)),
        key: 'selection',
      },
    ]);
  };
  const handleChangeYearAfterPeriod = (event) => {
    setYearAfterPeriod(event.target.value);
    setafterPeriod([
      {
        startDate: startOfMonth(new Date(new Date().setMonth(0)).setFullYear(event.target.value)),
        endDate: endOfMonth(new Date(new Date().setMonth(0)).setFullYear(event.target.value)),
        key: 'selection',
      },
    ]);
  };
  const getMarketingHeatMap = () => {
    if (isMarketingHeatMap) {
      return (
        <DatePickerKit
          onRangeFocusChange={(e) => e}
          minDate={new Date(minDate)}
          maxDate={maxDate}
          onChange={handleOnChange}
          showSelectionPreview
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={beforePeriod}
          direction="horizontal"
          dragSelectionEnabled={false}
          weekStartsOn={1}
        />
      );
    }
    return typeDate === 'month' ? (
      <LocalizationProviderKit dateAdapter={AdapterDayjs}>
        <div className="month-wrapper">
          <PaperKit className="year-dropdown-paper">
            <FormcontrolKit sx={{ m: 1, minWidth: 120 }} size="small">
              <SelectKit id="demo-select-small" value={year} onChange={(e) => handleChangeYear(e)}>
                {yearArr.map((y) => (
                  <MenuItemKit value={y} key={y}>
                    {y}
                  </MenuItemKit>
                ))}
              </SelectKit>
            </FormcontrolKit>
          </PaperKit>
          <MonthPickerKit
            className="month_picker"
            date={dayjs(beforePeriod[0].startDate)}
            minDate={minDate}
            maxDate={offer ? new Date(addYears(maxDate, 1)) : maxDate}
            onChange={(newDateMonth) =>
              setbeforePeriod([
                {
                  startDate: startOfMonth(new Date(newDateMonth).setFullYear(year)),
                  endDate:
                    getMonth(new Date(newDateMonth)) === getMonth(new Date()) && !offer
                      ? new Date().setFullYear(year)
                      : endOfMonth(new Date(newDateMonth).setFullYear(year)),
                  key: 'selection',
                },
              ])
            }
          />
        </div>
      </LocalizationProviderKit>
    ) : (
      <DatePickerKit
        onRangeFocusChange={(e) => e}
        minDate={new Date(minDate)}
        maxDate={offer ? new Date(addYears(new Date(), 1)) : new Date()}
        onChange={handleOnChange}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={beforePeriod}
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
          className="date-input"
        >
          <TypographyKit className="date-typography">
            <CalendarMonthIcon />
            <span>{getbeforePeriod()}</span>
          </TypographyKit>
          <ExpandMoreIcon className={`expand-img ${opened ? 'active' : ''}`} />
        </PaperKit>
      </div>
      <div
        role="presentation"
        tabIndex={-1}
        className={`date-range ${opened ? 'opened ' : ''}${typeDate === 'month' ? 'month' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <PaperKit style={{ background: '#fff' }} className="date-picker">
          {isMarketingHeatMap ? (
            <div>
              <DateSelect
                expanded={expanded}
                setExpanded={setExpanded}
                index="2"
                type="week"
                setSelections={setbeforePeriod}
                setTypeDate={setTypeDate}
                beforePeriod={beforePeriod}
                setupOffer={setupOffer}
              />
            </div>
          ) : (
            <div>
              {['day', 'week', 'month'].map((n, index) => (
                <DateSelect
                  expanded={expanded}
                  setExpanded={setExpanded}
                  index={index + 1}
                  key={n}
                  type={n}
                  setSelections={setbeforePeriod}
                  setTypeDate={setTypeDate}
                  beforePeriod={beforePeriod}
                  setupOffer={n === 'week' ? setupOffer : false}
                  setYear={setYear}
                  offer={offer}
                />
              ))}
            </div>
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
                className={`date-input ${selected ? 'selected' : ''}`}
              >
                <TypographyKit component="div" className="date-typography">
                  <CalendarMonthIcon />
                  <span>{getDateAfterPeriod()}</span>
                </TypographyKit>
                <ExpandMoreIcon className={`expand-img ${selected ? 'active' : ''}`} />
              </PaperKit>
              <AfterPeriodSelect
                setafterPeriodBtn={setAfterPeriodContext}
                setOpenedAfterPeriod={setOpenedAfterPeriod}
                setafterPeriod={setafterPeriod}
                selected={selected}
                afterPeriod={afterPeriodContext}
                setTitleAfterPeriod={setTitleafterPeriod}
                beforePeriod={beforePeriodContext}
                titlebeforePeriodContext={titleDate}
                typeDate={typeDate}
                setSelected={setSelected}
                setDateContext={setDateContext}
                dateContext={dateContext}
              />
            </TypographyKit>
          </div>
          <div
            role="presentation"
            tabIndex={-1}
            className={`date-range range-afterPeriodContext ${openedAfterPeriod ? 'opened' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <PaperKit style={{ background: '#fff' }} className="date-picker">
              {['day', 'week', 'month'].map((n, index) => (
                <DateSelect
                  expanded={expanded}
                  setExpanded={setExpanded}
                  index={index + 1}
                  key={n}
                  type={n}
                  setSelections={setafterPeriod}
                  setTypeDate={setTypeDate}
                  beforePeriod={afterPeriod}
                  setupOffer={n === 'week' ? setupOffer : false}
                  setYear={setYearAfterPeriod}
                />
              ))}
              <div className="date-btn-wrapper">
                <ButtonKit
                  disabled={!getafterPeriod()}
                  onClick={handleClickAfterPeriod}
                  className={`date-save-btn ${getafterPeriod() ? '' : 'date-disabled-btn'}`}
                  variant="contained"
                >
                  Ok
                </ButtonKit>
              </div>
            </PaperKit>
            {typeDate === 'month' ? (
              <LocalizationProviderKit dateAdapter={AdapterDayjs}>
                <div className="month-wrapper">
                  <PaperKit className="year-dropdown-paper">
                    <FormcontrolKit sx={{ m: 1, minWidth: 120 }} size="small">
                      <SelectKit
                        id="demo-select-small"
                        value={yearAfterPeriod}
                        onChange={(e) => handleChangeYearAfterPeriod(e)}
                      >
                        {yearArr.map((y) => (
                          <MenuItemKit value={y} key={y}>
                            {y}
                          </MenuItemKit>
                        ))}
                      </SelectKit>
                    </FormcontrolKit>
                  </PaperKit>
                  <MonthPickerKit
                    className="month_picker"
                    date={dayjs(afterPeriod[0].startDate)}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={(newDateMonth) =>
                      setafterPeriod([
                        {
                          startDate: startOfMonth(
                            new Date(newDateMonth).setFullYear(yearAfterPeriod),
                          ),
                          endDate:
                            getMonth(new Date()) === getMonth(new Date(newDateMonth))
                              ? new Date().setFullYear(yearAfterPeriod)
                              : endOfMonth(new Date(newDateMonth).setFullYear(yearAfterPeriod)),
                          key: 'selection',
                        },
                      ])
                    }
                  />
                </div>
              </LocalizationProviderKit>
            ) : (
              <DatePickerKit
                onRangeFocusChange={(e) => e}
                minDate={new Date(minDate)}
                maxDate={new Date()}
                onChange={handleOnChangeAfterPeriod}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={afterPeriod}
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
        className={`date-range-overlay ${openedAfterPeriod ? 'opened' : ''}`}
        onClick={() => setOpenedAfterPeriod(false)}
        onKeyDown={() => setOpenedAfterPeriod(false)}
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
