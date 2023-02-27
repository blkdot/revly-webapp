import { Arrow } from 'assets/icons';
import trash from 'assets/images/ic_trash.png';
import { useMarketingSetup } from 'hooks';
import TimePickerDropdown from 'components/timePicker/TimePickerDropdown';
import { addDays, differenceInDays, isSameDay } from 'date-fns';
import { ButtonKit, DatePickerDayKit, FormControlKit, RadioKit, TextfieldKit } from 'kits';
import { FC, useState } from 'react';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import CalendarCheckGrayIcon from '../../../../assets/images/ic_calendar-check-gray.svg';
import CalendarEventIcon from '../../../../assets/images/ic_calendar-event.png';

type stateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[];
};
type stateBranchType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[][];
};
type timesType = {
  startTime: Date;
  endTime: Date;
  pos: number;
}[];
const RecurencyStep: FC<{
  setStep: (value: string) => void;
  state: stateType;
  setState: (stateType) => void;
  setOpened: (value: boolean) => void;
  step: string;
  startingDate: number | Date;
  setStartingDate: (value: Date) => void;
  endingDate: number | Date;
  setEndingDate: (value: Date) => void;
  typeSchedule: string;
  setTypeSchedule: (value: string) => void;
  times: timesType;
  setTimes: (timesType) => void;
  stateBranch: stateBranchType;
  setStateBranch: (stateBranchType) => void;
  branchVendors: any;
}> = ({
  branchVendors,
  stateBranch,
  setStateBranch,
  setStep,
  state,
  setState,
  setOpened,
  step,
  startingDate,
  setStartingDate,
  endingDate,
  setEndingDate,
  typeSchedule,
  setTypeSchedule,
  times,
  setTimes,
}) => {
  const [disabled, setDisabled] = useState(false);
  const isEndingLimited = () => {
    if (isSameDay(new Date(endingDate), new Date(startingDate))) {
      return true;
    }

    return typeSchedule !== 'everyday';
  };
  const date = document.querySelectorAll('.date-error');
  const onChange = async (newValue: Date, type: string) => {
    if (type === 'start') {
      await setStartingDate(newValue);
    } else {
      await setEndingDate(newValue);
    }
    const arr = [];
    date.forEach((el) => arr.push(el.children[0].classList.contains('Mui-error')));
    setDisabled(!arr.every((bool) => bool === false));
    const stateTemp = { ...state };
    stateTemp.content.find((obj) => obj.title === 'Days').value = `${
      Math.abs(
        differenceInDays(
          type === 'start' ? new Date(newValue) : startingDate,
          type === 'end' ? new Date(newValue) : endingDate
        )
      ) + 1
    } Days`;
    setState({ ...stateTemp });
  };

  const { disableWeekends } = useMarketingSetup();
  const [customised, setCustomised] = useState([]);
  const typeScheduleArr = [
    { type: 'everyday', title: 'Every day' },
    { type: 'workweek', title: 'Work week' },
    { type: 'weekend', title: 'Week-end days' },
    { type: customised.toString().toLowerCase().replace(/,/g, '.'), title: 'Customised' },
  ];
  const getWorkWeek = () => {
    if (typeSchedule === 'workweek') {
      // checking if endingDate eqaul sunday we put monday
      if (new Date(endingDate).getDay() === 0) {
        return new Date(addDays(endingDate, 1));
      }
      // checking if endingDate eqaul saturday we put monday
      if (new Date(endingDate).getDay() === 6) {
        return new Date(addDays(endingDate, 2));
      }
      return endingDate;
    }
    return endingDate;
  };
  const handleClick = () => {
    setStep('budget');
    const stateTemp = { ...state };
    const stateBranchTemp = { ...stateBranch };
    stateTemp.content.find((obj) => obj.title === 'Total budget').value = 'AED 0';
    stateBranchTemp.content = selectedVendors('name', branchVendors.display).map((name) => [
      {
        title: 'Branch Name',
        value: name,
      },
      {
        title: 'Bid',
        value: '',
      },
      {
        title: 'Branch budget',
        value: 'AED 0',
      },
    ]);
    setState({ ...stateTemp });
    setStateBranch({ ...stateBranchTemp });
  };
  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>2. Setup your Advert schedule and recurency</p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll
          appear in the Featured section of the app
        </span>
        <div className='advert-schedule'>
          <div className='advert-title-icon'>
            <span>
              <img src={CalendarCheckGrayIcon} alt='CalendarCheckIcon' />
            </span>
            <p>Your Advert Schedule </p>
          </div>
          <div className='adverts-date-picker'>
            <div className='picker-duration'>
              <div>
                Starting Date
                <DatePickerDayKit
                  className='date-error'
                  shouldDisableDate={typeSchedule === 'workweek' ? disableWeekends : null}
                  value={startingDate}
                  onChange={(newValue) => {
                    onChange(newValue, 'start');
                  }}
                  minDate={new Date()}
                  renderInput={(params) => <TextfieldKit {...params} />}
                />
              </div>
              <div>
                Ending Date
                <DatePickerDayKit
                  className='date-error'
                  shouldDisableDate={typeSchedule === 'workweek' ? disableWeekends : null}
                  minDate={new Date(startingDate)}
                  value={getWorkWeek()}
                  onChange={(newValue) => {
                    onChange(newValue, 'end');
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
                    Start Time {i + 1}
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
                    End Time {i + 1}
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
          </div>
        </div>
        <div className='advert-duration'>
          <div className='advert-title-icon'>
            <span>
              <img src={CalendarEventIcon} alt='CalendarEventIcon' />
            </span>
            <p>Your Advert Schedule </p>
          </div>
          <div className='adverts-duration-picker'>
            <FormControlKit
              value={typeSchedule}
              onChange={(e) => {
                setTypeSchedule(e.target.value);
                const stateTemp = { ...state };
                stateTemp.content.find((obj) => obj.title === 'Reccurence').value =
                  typeScheduleArr.find((obj) => obj.type === e.target.value).title;
                setState({ ...stateTemp });
              }}
            >
              {typeScheduleArr.map((obj) => (
                <div key={obj.type} className='adverts-radio'>
                  <RadioKit checked={obj.type === typeSchedule} value={obj.type} />
                  <p>{obj.title}</p>
                </div>
              ))}
            </FormControlKit>
          </div>
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit
          onClick={handleClick}
          disabled={disabled}
          className='continue'
          variant='contained'
        >
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default RecurencyStep;
