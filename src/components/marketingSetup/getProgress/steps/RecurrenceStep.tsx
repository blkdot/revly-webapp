import TimerIcon from 'assets/images/ic_timer.png';
import trash from 'assets/images/ic_trash.png';
import plus from 'assets/images/plus.png';
import CompetitionDropdown from 'components/competitionDropdown/CompetitionDropdown';
import MarketingCheckmarksDropdown from 'components/marketingSetup/MarketingChecmarksDropdown';
import TimePickerDropdown from 'components/timePicker/TimePickerDropdown';
import { getHours } from 'date-fns';
import BoxKit from 'kits/box/BoxKit';
import ButtonKit from 'kits/button/ButtonKit';
import DatePickerDayKit from 'kits/datePicker/DatePickerDayKit';
import TextfieldKit from 'kits/textfield/TextfieldKit';
import TypographyKit from 'kits/typography/TypographyKit';
import { FC } from 'react';
import { Subtitle } from './components/Subtitle';

// eslint-disable-next-line import/prefer-default-export
export const RecurrenceStep: FC<{
  index: number;
  typeSchedule: any;
  everyWeek: any;
  setEveryWeek: any;
  days: any;
  customisedDay: any;
  setCustomisedDay: any;
  times: any;
  setTimes: any;
  disableWeekends: any;
  startingDate: any;
  setStartingDate: any;
  onChange: any;
  getWorkWeek: any;
  setEndingDate: any;
  isEndingLimited: any;
  heatmapData: any;
  setHeatmapData: any;
  links: any;
}> = ({
  index,
  typeSchedule,
  everyWeek,
  setEveryWeek,
  days,
  customisedDay,
  setCustomisedDay,
  times,
  setTimes,
  disableWeekends,
  startingDate,
  setStartingDate,
  onChange,
  getWorkWeek,
  setEndingDate,
  isEndingLimited,
  heatmapData,
  setHeatmapData,
  links,
}) => (
  <div className='left-part-middle'>
    <TypographyKit variant='h6'>{index}. Select the Recurrence detail</TypographyKit>
    <Subtitle />
    <BoxKit className='left-part-radio under-textfields radio-dates active'>
      <div className='radio'>
        <div>
          <span>
            <img style={{ filter: 'none' }} src={TimerIcon} alt='Timer Icon' />
          </span>
          <div>
            <div>Recurrence Details</div>
            <p>{typeSchedule}</p>
          </div>
        </div>
      </div>
      {typeSchedule === 'Same day every week' ? (
        <CompetitionDropdown
          rows={[
            'Every Monday',
            'Every Tuesday',
            'Every Wednesday',
            'Every Thursday',
            'Every Friday',
            'Every Saturday',
            'Every Sunday',
          ]}
          title={typeSchedule}
          className='top-competition marketing-setup-dropdown'
          setRow={setEveryWeek}
          select={everyWeek}
        />
      ) : (
        ''
      )}
      {typeSchedule === 'Customised Days' ? (
        <MarketingCheckmarksDropdown
          names={days}
          setName={setCustomisedDay}
          personName={customisedDay}
        />
      ) : (
        ''
      )}
      <div className='picker-duration'>
        <div>
          Starting Date
          <DatePickerDayKit
            className='date-error'
            shouldDisableDate={typeSchedule === 'Work Week' ? disableWeekends : null}
            value={startingDate}
            onChange={(newValue) => {
              onChange(newValue, setStartingDate);
            }}
            minDate={new Date()}
            renderInput={(params) => <TextfieldKit {...params} />}
          />
        </div>
        <div>
          Ending Date
          <DatePickerDayKit
            className='date-error'
            shouldDisableDate={typeSchedule === 'Work Week' ? disableWeekends : null}
            minDate={new Date(startingDate)}
            value={getWorkWeek()}
            onChange={(newValue) => {
              onChange(newValue, setEndingDate);
            }}
            renderInput={(params) => <TextfieldKit {...params} />}
          />
        </div>
      </div>
      {times.map((obj, i) =>
        times.length > 1 ? (
          <div
            key={obj.pos}
            className='picker-duration'
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              Start Time {obj.pos}
              <TimePickerDropdown
                startLimit={i === 0 ? null : times[i - 1].endTime}
                value={obj.startTime}
                setValue={setTimes}
                times={times}
                index={i}
                type='startTime'
              />
            </div>
            <div style={{ width: '100%' }}>
              End Time {obj.pos}
              <TimePickerDropdown
                startLimit={isEndingLimited() ? obj.startTime : null}
                value={obj.endTime}
                setValue={setTimes}
                times={times}
                index={i}
                type='endTime'
              />
            </div>
            <div className='trash-wrapper'>
              <img
                role='presentation'
                tabIndex={-1}
                onClick={() => {
                  times.splice(i, 1);
                  setTimes([...times]);
                  Object.values(heatmapData[links]).forEach((objHeat) => {
                    Object.keys(objHeat).forEach((num: any) => {
                      if (num === getHours(obj.startTime)) {
                        if (objHeat[num].active) {
                          // TODO: FIX IT
                          // eslint-disable-next-line no-param-reassign
                          delete heatmapData[links][new Date(startingDate).getDay() - 1][num];
                          setHeatmapData({ ...heatmapData });
                        }
                      }
                    });
                  });
                }}
                src={trash}
                alt='trash'
              />
            </div>
          </div>
        ) : (
          <div
            key={obj.pos}
            className='picker-duration'
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              Start Time
              <TimePickerDropdown
                startLimit={i === 0 ? null : times[i - 1].endTime}
                value={obj.startTime}
                setValue={setTimes}
                times={times}
                index={i}
                type='startTime'
              />
            </div>
            <div style={{ width: '100%' }}>
              End Time
              <TimePickerDropdown
                startLimit={isEndingLimited() ? obj.startTime : null}
                value={obj.endTime}
                setValue={setTimes}
                times={times}
                index={i}
                type='endTime'
              />
            </div>
          </div>
        )
      )}
      {typeSchedule === 'Continues Offer' || times.length === 3 ? (
        ''
      ) : (
        <ButtonKit
          onClick={() =>
            setTimes([
              ...times,
              {
                startTime: new Date(
                  null,
                  null,
                  null,
                  // TODO: FIX IT
                  // format(addHours(times[times.length - 1].endTime, 1), 'HH'),
                  null,
                  0
                ),
                endTime: new Date(
                  null,
                  null,
                  null,
                  // TODO: FIX IT
                  // format(addHours(times[times.length - 1].endTime, 1), 'HH'),
                  null,
                  0
                ),
                pos: times[times.length - 1].pos + 1,
              },
            ])
          }
          className='another-slot'
          variant='contained'
        >
          <img src={plus} alt='plus' />
          Add Another Slot
        </ButtonKit>
      )}
    </BoxKit>
  </div>
);
