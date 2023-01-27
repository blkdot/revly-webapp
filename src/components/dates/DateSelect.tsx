import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useState, useEffect } from 'react';
import {
  endOfMonth,
  endOfWeek,
  getMonth,
  getWeek,
  getYear,
  isSameYear,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TypographyKit from '../../kits/typography/TypographyKit';
import ButtonKit from '../../kits/button/ButtonKit';
import AccordionSummaryKit from '../../kits/accordionSummary/AccordionSummaryKit';
import AccordionKit from '../../kits/accordion/AccordionKit';
import AccordionDetailsKit from '../../kits/accordionDetails/AccordionDetails';

const DateSelect = React.memo((props) => {
  const [active, setActive] = useState('current');
  const {
    type,
    setSelections,
    setTypeDate,
    expanded,
    setExpanded,
    index,
    beforePeriod,
    setupOffer,
    setYear,
    offer,
  } = props;
  useEffect(() => {
    const date = new Date();
    const startDate = new Date(beforePeriod[0].startDate);
    const endDate = new Date(beforePeriod[0].endDate);
    const startLocal = startDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();
    const dateLocal = date.toLocaleDateString();
    const getActive = () => {
      if (type === 'day') {
        if (startLocal === dateLocal && isSameYear(date, startDate)) {
          setActive('current');
        } else if (startLocal === subDays(new Date(), 1).toLocaleDateString()) {
          setActive('last');
        } else {
          setActive('custom');
        }
      } else if (type === 'week') {
        if (endGetDay === dateGetDay && startGetDay === 1 && isSameYear(date, startDate)) {
          setActive('current');
        } else if (
          getWeek(startDate, { weekStartsOn: 1 }) === getWeek(date, { weekStartsOn: 1 }) &&
          offer &&
          isSameYear(date, startDate)
        ) {
          setActive('current');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 }) &&
          getYear(startDate) === getYear(date) - 1
        ) {
          setActive('last');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 }) &&
          isSameYear(date, startDate)
        ) {
          setActive('last');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 4), { weekStartsOn: 1 }) &&
          getWeek(endDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 }) &&
          setupOffer
        ) {
          setActive('last 4');
        } else {
          setActive('custom');
        }
      } else if (type === 'month') {
        if (
          startGetDate === 1 &&
          endGetDate >= dateGetDate &&
          getMonth(startDate) === getMonth(date) &&
          getYear(startDate) === getYear(date)
        ) {
          setActive('current');
        } else if (
          getMonth(startDate) === getMonth(date) &&
          offer &&
          getYear(startDate) === getYear(date)
        ) {
          if (getMonth(startDate) === getMonth(date)) {
            setActive('current');
          }
        } else if (getMonth(startDate) === getMonth(subMonths(date, 1))) {
          if (getMonth(date) === 0 && getYear(startDate) === getYear(date) - 1) {
            setActive('last');
          } else if (
            new Date(startDate).toLocaleDateString() ===
              new Date(startOfMonth(subMonths(new Date(), 1))).toLocaleDateString() &&
            isSameYear(date, startDate)
          ) {
            setActive('last');
          } else {
            setActive('custom');
          }
        } else {
          setActive('custom');
        }
      } else {
        setActive('custom');
      }
    };
    getActive();
  }, [beforePeriod, type]);

  const getDate = (date) => {
    const today = new Date();
    switch (date) {
      case 'today':
        setSelections([{ startDate: today, endDate: today, key: 'selection' }]);
        setActive('current');
        break;
      case 'yesterday':
        setSelections([
          { startDate: subDays(today, 1), endDate: subDays(today, 1), key: 'selection' },
        ]);
        setActive('last');
        break;
      case 'week':
        setSelections([
          {
            startDate: startOfWeek(today, { weekStartsOn: 1 }),
            endDate: offer ? endOfWeek(today, { weekStartsOn: 1 }) : today,
            key: 'selection',
          },
        ]);
        setActive('current');
        break;
      case 'last week':
        setSelections([
          {
            startDate: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
            key: 'selection',
          },
        ]);
        setActive('last');
        break;
      case 'last 4 weeks':
        setSelections([
          {
            startDate: startOfWeek(subWeeks(today, 4), { weekStartsOn: 1 }),
            endDate: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
            key: 'selection',
          },
        ]);
        setActive('last 4');
        break;
      case 'month':
        setSelections([
          {
            startDate: startOfMonth(today),
            endDate: offer ? endOfMonth(today) : today,
            key: 'selection',
          },
        ]);
        setActive('current');
        setYear(new Date().getFullYear());
        break;
      case 'last month':
        setSelections([
          {
            startDate: startOfMonth(subMonths(today, 1)),
            endDate: endOfMonth(subMonths(today, 1)),
            key: 'selection',
          },
        ]);
        setActive('last');
        setYear(new Date(subMonths(today, 1)).getFullYear());
        break;
      default:
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const changeSelect = () => {
    setTypeDate(type);
    if (type === 'day') {
      setSelections([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
      setYear(new Date().getFullYear());
    } else if (type === 'week') {
      setSelections([
        {
          startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
          endDate: offer ? endOfWeek(new Date(), { weekStartsOn: 1 }) : new Date(),
          key: 'selection',
        },
      ]);
      setYear(new Date().getFullYear());
    } else {
      setSelections([
        { startDate: startOfMonth(new Date()), endDate: new Date(), key: 'selection' },
      ]);
      setYear(new Date().getFullYear());
    }
  };

  const handleCustomClick = () => {
    setTypeDate(type);
    setActive('custom');
  };

  return (
    <AccordionKit
      aria-controls={`panel${index}bh-content`}
      id={`panel${index}bh-header`}
      expanded={expanded === `panel${index}`}
      onChange={handleChange(`panel${index}`)}
      className="navbar-accordion"
    >
      <ButtonKit
        onClick={changeSelect}
        className={`navbar-button-kit ${expanded === `panel${index}` ? 'active' : ''}`}
      >
        <AccordionSummaryKit className="accordion-sum" expandIcon={<ExpandMoreIcon />}>
          <TypographyKit
            sx={{ display: 'flex', alignItems: 'center', gridGap: '5px', fontSize: '16px' }}
          >
            <span>{type}</span>
          </TypographyKit>
        </AccordionSummaryKit>
      </ButtonKit>
      <AccordionDetailsKit className="date-accordion-details">
        <ButtonKit
          className={`navbar-button-kit ${active === 'current' ? 'active' : ''}`}
          onClick={() => getDate(type === 'day' ? 'today' : type)}
        >
          Current {type}
        </ButtonKit>
        <ButtonKit
          className={`navbar-button-kit ${active === 'last' ? 'active' : ''}`}
          onClick={() => getDate(type === 'day' ? 'yesterday' : `last ${type}`)}
        >
          {type === 'day' ? 'yesterday' : `last ${type}`}
        </ButtonKit>
        {setupOffer ? (
          <ButtonKit
            className={`navbar-button-kit ${active === 'last 4' ? 'active' : ''}`}
            onClick={() => getDate('last 4 weeks')}
          >
            Last 4 weeks
          </ButtonKit>
        ) : (
          ''
        )}
        <ButtonKit
          className={`navbar-button-kit ${active === 'custom' ? 'active' : ''}`}
          onClick={handleCustomClick}
        >
          Custom {type}
        </ButtonKit>
      </AccordionDetailsKit>
    </AccordionKit>
  );
});

export default DateSelect;
