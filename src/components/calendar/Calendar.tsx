import React, {FC, useState, useMemo, useCallback} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  BoxKit,
  TypographyKit,
  ButtonKit,
} from '../../kits';

dayjs.extend(duration);

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timesOfDay = [
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
  '0 AM'
];

const Calendar: FC = () => {

  const [startDate, setStartDate] = useState<Date>(dayjs().startOf('week').toDate());

  const timeslotHeight = useMemo(() => 70, []);

  const datesOfWeek = useMemo(() => {
    const dates = [];

    for (let i = 1; i <= 7; ++i) {
      dates.push(dayjs(startDate).add(i, 'day'));
    }

    return dates;
  }, [startDate]);

  const today = useMemo(() => dayjs().startOf('day'), []);

  const renderHeaderDates = () => (
    <BoxKit sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
    }}>
      <BoxKit width='88px' />
      {days.map((day, index) => (
        <BoxKit key={day} sx={{
          flex: '1 1',
          borderRight: '1px solid #FAFAFA',
          borderBottom: '1px solid #FAFAFA',
          textAlign: 'center',
          height: '68px',
          padding: '10px',
        }}>
          <BoxKit position='relative'>
            <ButtonKit
              variant={dayjs(today).isSame(datesOfWeek[index]) ? 'contained' : 'text'}
              sx={{
                borderRadius: '50%',
                width: '30px',
                minWidth: 0,
                height: '30px',
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '16.8px',
                mb: '3px',
              }}
            >
              {dayjs(datesOfWeek[index]).date()}
            </ButtonKit>
            <TypographyKit
              sx={{
                fontSize: '12px',
                lineHeight: '15px',
                fontFamily: 'Lato',
                fontWeight: 400,
              }}
            >
              {day}
            </TypographyKit>
          </BoxKit>
        </BoxKit>
      ))}
    </BoxKit>
  );

  const renderTimeslotLabels = () => timesOfDay.map((time, index) => (
    <BoxKit key={time} sx={{
      textAlign: 'right',
      paddingRight: '8px',
      position: 'relative',
    }}>
      <TypographyKit sx={{
        position: 'relative',
        bottom: '0px',
        height: timeslotHeight,
      }}>
        {time}
      </TypographyKit>
    </BoxKit>
  ));

  const renderTimeGrid = () => (
    <BoxKit sx={{
      flex: '1 1',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
    }}>
      <BoxKit>
        {timesOfDay.map((day, index) => (
          <BoxKit key={day} sx={{
            height: timeslotHeight,
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              borderBottom: '1px solid #FAFAFA',
            }
          }}/>
        ))}
      </BoxKit>
      {datesOfWeek.map((date, index) => (
        // TODO: render items here
        <BoxKit
          key={date.toString()}
          flex='1 1'
          borderRight='1px solid #FAFAFA'
          backgroundColor={dayjs(date).isBefore(today) ? '#FAFAFA' : undefined}
        />
      ))}
    </BoxKit>
  );

  return (
    <BoxKit p='0 20px 20px 20px' backgroundColor='#fff'>
      <BoxKit>
        <BoxKit sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '4px 4px 0 0',
          background: '#FAFAFA',
        }}>
          {renderHeaderDates()}
        </BoxKit>
        <BoxKit sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '0 0 4px 4px',
        }}>
          <BoxKit sx={{
            background: '#FAFAFA',
            width: '88px',
          }}>
            {renderTimeslotLabels()}
          </BoxKit>
          <BoxKit flex='1 1'>
            {renderTimeGrid()}
          </BoxKit>
        </BoxKit>
      </BoxKit>
    </BoxKit>
  );
};

export default Calendar;
