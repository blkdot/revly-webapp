import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './Dates.scss';
import React, { useState, useEffect } from 'react';
import {
  endOfMonth,
  endOfWeek,
  getMonth,
  getWeek,
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
        if (startLocal === dateLocal) {
          setActive('current');
        } else if (startLocal === subDays(date, 1).toLocaleDateString()) {
          setActive('last');
        } else {
          setActive('custom');
        }
      } else if (type === 'week') {
        if (endGetDay === dateGetDay && startGetDay === 1) {
          setActive('current');
        } else if (
          startGetDay === 1 &&
          endGetDay === 0 &&
          getWeek(startDate, { weekStartsOn: 1 }) ===
            getWeek(subWeeks(date, 1), { weekStartsOn: 1 })
        ) {
          setActive('last');
        } else {
          setActive('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(date, 1)) {
        if (startGetDate === 1 && endGetDate >= dateGetDate) {
          setActive('current');
        } else if (
          getMonth(startDate, 1) === getMonth(subMonths(date, 1)) &&
          endDate === endOfMonth(startDate, 1)
        ) {
          setActive('last');
        } else {
          setActive('custom');
        }
      } else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setActive('last');
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
            endDate: today,
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
            startDate: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
            endDate: startOfWeek(subWeeks(today, 4), { weekStartsOn: 1 }),
            key: 'selection',
          },
        ]);
        setActive('last 4');
        break;
      case 'month':
        setSelections([{ startDate: startOfMonth(today), endDate: today, key: 'selection' }]);
        setActive('current');
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
    } else if (type === 'week') {
      setSelections([
        {
          startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
          endDate: new Date(),
          key: 'selection',
        },
      ]);
    } else {
      setSelections([
        { startDate: startOfMonth(new Date()), endDate: new Date(), key: 'selection' },
      ]);
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
