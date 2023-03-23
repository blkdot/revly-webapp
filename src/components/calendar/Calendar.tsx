import React, {FC, useState, useMemo, useCallback} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  TypographyKit
} from '../../kits';
import './Calendar.scss';

dayjs.extend(duration);

const days = ['SUN', 'MON', 'THE', 'WEN', 'THU', 'FRI', 'SAT'];
const timesOfDay = [
  "",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

const Calendar: FC = () => {

  const [startDate, setStartDate] = useState<Date>(dayjs().startOf('week').toDate());

  const timeslotHeight = useMemo(() => 48, []);

  const renderDates = () => (
    <TypographyKit className='calendar-dates-container' variant='div'>
      <TypographyKit className='calendar-dates-gap' variant='div'/>
      {days.map((day, index) => (
        <TypographyKit className='calendar-dates' variant='div' key={day}>
          <TypographyKit style={{position: 'relative'}} variant='div'>
            <TypographyKit variant='div'>{day}</TypographyKit>
            <TypographyKit variant='div'>{dayjs(startDate).add(index + 1, 'day').date()}</TypographyKit>
          </TypographyKit>
        </TypographyKit>
      ))}
    </TypographyKit>
  );

  const renderTimeslotLabels = () => timesOfDay.map((time, index) => (
    <TypographyKit className='time-slots' variant='div' key={time}>
      <div className='slots-label' style={{height: timeslotHeight}}>{time}</div>
    </TypographyKit>
  ));

  const renderTimeGrid = () => (
    <TypographyKit className='time-grid' variant='div'>
      <TypographyKit className='time-slots-line-container' variant='div'>
        {timesOfDay.map((day, index) => (
          <div key={day} className='time-slots-line' style={{height: timeslotHeight}} />
        ))}
      </TypographyKit>
      {days.map((timeslot, index) => (
        // TODO: render items here
        <TypographyKit className='grid-date' variant='div' key={timeslot} />
      ))}
    </TypographyKit>
  );

  return (
    <TypographyKit className='page-container' variant='div'>
      <TypographyKit className='calendar-container' variant='div'>
        <TypographyKit className='calendar-header' variant='div'>
          {renderDates()}
        </TypographyKit>
        <TypographyKit className='calendar-body' variant='div'>
          <TypographyKit className='time-slot-labels-container' variant='div'>
            {renderTimeslotLabels()}
          </TypographyKit>
          <TypographyKit className='time-grid-container' variant='div'>
            {renderTimeGrid()}
          </TypographyKit>
        </TypographyKit>
      </TypographyKit>
    </TypographyKit>
  );
};

export default Calendar;