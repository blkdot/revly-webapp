import ArrowIcon from 'assets/images/arrow.svg';
import CalendarCheckedIcon from 'assets/images/ic_calendar-checked.png';
import CalendarEventIcon from 'assets/images/ic_calendar-event.png';
import TimePickerDropdown from 'components/timePicker/TimePickerDropdown';
import { addMinutes, format } from 'date-fns';
import {
  BoxKit,
  DatePickerDayKit,
  FormControlLabelKit,
  RadioGroupKit,
  RadioKit,
  TextfieldKit,
  TypographyKit,
} from 'kits';
import { FC } from 'react';
import { Subtitle } from './components/Subtitle';

// eslint-disable-next-line import/prefer-default-export
export const DurationStep: FC<{
  index: number;
  duration: any;
  setDuration: any;
  endingDate: any;
  setEndingDate: any;
  onChange: any;
  typeSchedule: any;
  setTypeSchedule: any;
  times: any;
  setTimes: any;
  isEndingLimited: any;
}> = ({
  index,
  duration,
  setDuration,
  endingDate,
  setEndingDate,
  onChange,
  typeSchedule,
  setTypeSchedule,
  times,
  setTimes,
  isEndingLimited,
}) => (
  <div className='left-part-middle'>
    <TypographyKit variant='h6'>{index}. Select the Duration</TypographyKit>
    <Subtitle />
    <RadioGroupKit
      className='duration-wrapper'
      aria-labelledby='demo-radio-buttons-group-label'
      value={duration}
      onChange={(e) => {
        setDuration(e.target.value);
      }}
      name='radio-buttons-group-duration'
    >
      <BoxKit
        className={`left-part-radio under-textfields radio-dates ${
          duration === 'Starting Now' && 'active'
        }`}
      >
        <div className='radio'>
          <div>
            <span>
              <img src={CalendarCheckedIcon} alt='Calendar checked Icon' />
            </span>
            <div>
              <div>Starting Now</div>
              <p>{format(addMinutes(new Date(), 2), 'dd MMM yyyy HH:mm')}</p>
            </div>
          </div>
          <FormControlLabelKit value='Starting Now' control={<RadioKit />} />
        </div>
        <div
          className='picker-duration'
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
        >
          <div style={{ width: '100%' }}>
            Ending Date
            <DatePickerDayKit
              className='date-error'
              minDate={new Date()}
              value={endingDate}
              onChange={(newValue) => {
                onChange(newValue, setEndingDate);
              }}
              renderInput={(params) => <TextfieldKit {...params} />}
            />
          </div>
          {times.map((obj, i) => (
            <div key={obj.pos} className='picker-duration' style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                End Time
                <TimePickerDropdown
                  value={obj.endTime}
                  setValue={setTimes}
                  startLimit={isEndingLimited() ? obj.startTime : null}
                  times={times}
                  index={i}
                  type='endTime'
                />
              </div>
            </div>
          ))}
        </div>
      </BoxKit>
      <BoxKit
        className={`left-part-radio under-textfields ${
          duration === 'Program the offer duration' && 'active'
        }`}
      >
        <div className='radio'>
          <div>
            <span>
              <img src={CalendarEventIcon} alt='Calendar Event Icon' />
            </span>
            <div>
              <div>Program the offer duration</div>
              <p>
                {typeSchedule || 'Recurrence customized'}
                <img src={ArrowIcon} alt='arrow' />
              </p>
            </div>
          </div>
          <FormControlLabelKit value='Program the offer duration' control={<RadioKit />} />
        </div>
        <div>
          <RadioGroupKit
            className='radio-group-day'
            aria-labelledby='demo-radio-buttons-group-label'
            value={typeSchedule}
            onChange={(e) => setTypeSchedule(e.target.value)}
            name='radio-buttons-group-days'
          >
            {[
              'Continues Offer',
              'Every Day',
              'Work Week',
              'Same day every week',
              'Customised Days',
            ].map((day) => (
              <div key={day}>
                <FormControlLabelKit value={day} control={<RadioKit />} />
                <span>{day}</span>
              </div>
            ))}
          </RadioGroupKit>
        </div>
      </BoxKit>
    </RadioGroupKit>
  </div>
);
