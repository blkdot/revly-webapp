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
  
  const renderEventItem = () => (
    <BoxKit p='4px 5px' backgroundColor='#C1D5FF' sx={{ borderRadius: '23px 23px 12px 12px', maxWidth: '173px'}}>
      <BoxKit p='4px' backgroundColor='#2F74FF' sx={{ borderRadius: '60px', display: 'flex', justifyContent: 'space-between', height: '36px' }}>
        <BoxKit sx={{display: 'flex'}}>
          <div style={{borderRadius: '50%', width: '28px', height: '28px', background: '#FF5A00', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.17718 14.6453C7.52384 14.6453 7.10809 14.532 6.81112 14.1922C6.57354 13.909 6.45475 13.456 6.45475 12.7764V8.6987H9.36505L9.00869 5.64046H6.51415V2.86537V0.600006C6.51415 0.600006 5.38566 0.656647 5.0293 0.713281C3.1287 0.82655 1.88142 2.07249 1.88142 3.43172V5.81036L0.0996094 5.92363V8.75534H1.88142V13.456C1.88142 14.8718 2.29718 16.0045 3.0693 16.854C3.84142 17.7035 5.02929 18.1 6.57353 18.1C7.34565 18.1 7.9396 18.0433 8.47415 17.9867C9.30566 17.8168 9.89959 17.1372 9.89959 16.2877V14.2488C9.30566 14.4754 8.71172 14.6453 8.17718 14.6453Z" fill="white"/>
            </svg>
          </div>
          <div style={{borderRadius: '50%', width: '28px', height: '28px', background: '#35B8B2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px'}}>
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4894 9.22134L13.372 0.829086L18.1903 1.33552L16.8881 13.7213L14.1389 19.8708L2.11484 17.3097L0.899414 11.6667L7.72897 10.2197L6.23862 3.14419L10.9846 2.1458L12.4894 9.22134Z" fill="white"/>
              <path d="M11.9251 13.5187C12.4025 13.7502 12.8656 13.7068 13.0537 13.3885C13.2273 13.0847 13.3141 12.7663 13.1405 12.4769C12.9669 12.1875 12.6775 12.0284 12.3157 12.0429C12.1132 12.0429 11.9251 12.231 11.8093 12.3757C11.7225 12.4769 11.6646 12.6072 11.6501 12.7374C11.6067 12.9834 11.6067 13.3596 11.9251 13.5187Z" fill="#35B8B2"/>
              <path d="M9.01978 12.7398C9.49727 12.9713 9.96029 12.9279 10.1484 12.6095C10.322 12.3057 10.4088 11.9874 10.2352 11.698C10.0616 11.4086 9.77219 11.2494 9.41046 11.2639C9.20789 11.2639 9.01978 11.452 8.90403 11.5967C8.81721 11.698 8.75933 11.8282 8.74487 11.9584C8.70146 12.2044 8.70146 12.5806 9.01978 12.7398Z" fill="#35B8B2"/>
            </svg>
          </div>
          <div style={{borderRadius: '50%', width: '28px', height: '28px', background: '#19AD33', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px'}}>
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5229 0.200012C14.5723 0.546817 16.4994 1.71334 17.7229 3.44736C17.9676 3.79417 18.2123 4.1725 18.3959 4.58236C17.6006 5.14986 16.8053 5.68583 16.0406 6.25333C15.9182 6.34791 15.8265 6.41097 15.6735 6.47402C15.3065 5.52819 14.6641 4.67694 13.8382 4.10944C13.2265 3.69958 12.5229 3.41584 11.8194 3.2582C12.0335 2.24931 12.2782 1.24043 12.5229 0.200012ZM5.12058 1.11432C6.06882 0.799038 7.16999 1.30348 7.56764 2.21778C7.90411 2.91139 7.81235 3.8257 7.35352 4.42472C6.77235 5.18139 5.67117 5.46514 4.84529 5.02375C4.2947 4.74 3.86647 4.20403 3.74412 3.57347C3.65235 3.10056 3.68294 2.59612 3.92764 2.15473C4.17235 1.65029 4.63117 1.30348 5.12058 1.11432ZM0.899414 11.8653C2.03118 11.8337 3.13235 11.8653 4.26411 11.8653C4.47823 13.1264 4.99823 14.3244 5.82411 15.2702C6.46646 16.0269 7.29235 16.5629 8.1794 16.9097C9.40293 17.3826 10.7488 17.4457 12.0335 17.1304C13.1959 16.8466 14.2359 16.1845 15.0006 15.2072C15.5206 14.5451 15.9182 13.7884 16.1323 12.9687C17.1417 13.2525 18.09 13.6308 19.0994 13.9461C19.0688 14.2614 18.9464 14.5766 18.8241 14.8919C18.1512 16.689 16.897 18.2338 15.2759 19.2112C14.2359 19.8418 13.0429 20.2516 11.85 20.4093C9.49469 20.7245 7.01705 20.2201 5.02882 18.8644C3.95823 18.1393 3.01 17.1619 2.33706 16.0269C1.54177 14.8289 1.08294 13.3786 0.899414 11.8653Z" fill="white"/>
            </svg>
          </div>
        </BoxKit>
        <BoxKit sx={{borderRadius: '50%', width: '28px', height: '28px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <TypographyKit sx={{fontFamily: 'Public Sans', fontWeight: '500', fontSize: '12px', lineHeight: '14px', color: '#1E1E1E'}}>-15</TypographyKit>
          <TypographyKit sx={{fontFamily: 'Public Sans', fontWeight: '500', fontSize: '8px', lineHeight: '8px', color: '#1E1E1E'}}>%</TypographyKit>
        </BoxKit>
      </BoxKit>
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
            {renderEventItem()}
          </BoxKit>
        </BoxKit>
      </BoxKit>
    </BoxKit>
  );
};

export default Calendar;
