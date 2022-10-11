import { addDays, addHours, format, startOfWeek } from 'date-fns';
import React, { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import MarketingRadio from './MarketingRadio';
import plus from '../../assets/images/plus.png';
import CloseIcon from '../../assets/images/ic_close.png';
import Dates from '../dates/Dates';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './MarketingSetup.scss';
import PaperKit from '../../kits/paper/PaperKit';
import ContainerKit from '../../kits/container/ContainerKit';
import BoxKit from '../../kits/box/BoxKit';
import CompetitionDropdown from '../competitionDropdown/CompetitionDropdown';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import { OrderHeatMap } from '../../data/fakeDataMarketing';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import MarketingSetupStepper from '../marketingSetupStepper/MarketingSetupStepper';
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import RadioGroupKit from '../../kits/radioGroup/RadioGroupKit';
import BranchesIcon from '../../assets/images/ic_branch.png';
import menuIcon from '../../assets/images/ic_menu.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';
import CalendarCheckedIcon from '../../assets/images/ic_calendar-checked.png';
import CalendarEventIcon from '../../assets/images/ic_calendar-event.png';
import BasicTimePicker from '../timePicker/TimePicker';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import DatePickerDayKit from '../../kits/datePicker/DatePickerDayKit';
import ArrowIcon from '../../assets/images/arrow.png';
import TimerIcon from '../../assets/images/ic_timer.png';
import trash from '../../assets/images/ic_trash.png';
import MarketingCheckmarksDropdown from './MarketingChecmarksDropdown';
import MarketingPlaceholderDropdown from './MarketingPlaceholderDropdown';
import searchIcon from '../../assets/images/ic_search.png';

const MarketingSetup = ({ active, setActive }) => {
  const [branch, setBranch] = useState('');
  const [platform, setPlatform] = useState('talabat');
  const [selected, setSelected] = useState(1);
  const [links, setLinks] = useState(false);
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date()),
    endDate: new Date(),
  });
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date(addDays(new Date(startingDate), 1)));
  const [customDay, setCustomDay] = useState('');
  const [disabledDate, setDisabledDate] = useState(true);
  const [customisedDay, setCustomisedDay] = useState([]);
  const [times, setTimes] = useState([
    {
      startTime: new Date(null, null, null, format(new Date(), 'HH'), 0),
      endTime: new Date(null, null, null, format(addHours(new Date(), 1), 'HH'), 0),
      pos: 1,
    },
  ]);
  const [everyWeek, setEveryWeek] = useState('');
  const [itemMenu, setItemMenu] = useState('');
  const [category, setCategory] = useState('');

  const getHourArr = (hour) => {
    const arr = [];
    times.forEach((obj) =>
      Object.keys(obj).forEach((keys) => {
        if (keys === hour) {
          arr.push(format(obj[keys], 'HH:00'));
        }
      }),
    );
    return arr;
  };
  const getTypeOffer = () => {
    if (customDay === 'Continues Offer') {
      return 'once';
    }
    if (customDay === 'Every Day') {
      return 'everyday';
    }
    if (customDay === 'Work Week') {
      return 'workweek';
    }
    if (customDay === 'Same day every week') {
      return everyWeek.toLowerCase().replace('every', '');
    }
    if (customDay === 'Customised Days') {
      return customisedDay.toString().toLowerCase().replace(/,/g, '.');
    }
    return '';
  };

  // Here is data which need to request
  const data = {
    start_date: format(startingDate, 'dd/MM/yyyy'),
    start_hour: getHourArr('startTime'),
    end_date: format(endingDate, 'dd/MM/yyyy'),
    end_hour: getHourArr('endTime'),
    type_offer: getTypeOffer(),
    goal: 'orders',
    discount: Number(discountPercentage.replace('%', '')) || '',
    mov: Number(minOrder.replace('%', '')) || '',
  };
  useEffect(() => {
    console.log(data);
  }, []);
  const [steps, setSteps] = useState([0, 1, 2, 3]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const heatMap = () => {
    const heatMapValues = OrderHeatMap.values;
    const heatMapObj = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thusday: {},
      Friday: {},
      Saturday: {},
      Sunday: {},
    };
    Object.keys(heatMapObj).forEach((day) => {
      for (let i = 5; i < 25; i++) {
        heatMapObj[day] = { ...heatMapObj[day], [i]: {} };
      }
    });
    Object.keys(heatMapValues).forEach((day) => {
      Object.keys(heatMapObj[day]).forEach((num) => {
        heatMapObj[day][num] = heatMapValues[day][num] || {};
      });
    });
    return heatMapObj;
  };
  const getPlatform = (e) => {
    const { value } = e.target;
    setPlatform(value);
    if (value === 'talabat') {
      setSteps([0, 1, 2, 3]);
    } else {
      setSteps([0, 1, 2, 3, 4]);
    }
  };
  const disableWeekends = (date) => date.getDay() === 0 || date.getDay() === 6;
  const onChange = async (newValue, setDate) => {
    setDate(newValue);
    const date = await document.querySelectorAll('.date-error');
    const arr = [];
    date.forEach((el) => arr.push(el.children[0].classList.contains('Mui-error')));
    setDisabledDate(arr.every((bool) => bool === false));
  };
  const getProgress = () => {
    if (selected === 1) {
      return (
        <div className="left-part-middle">
          <TypographyKit variant="h6">1.Select platform and branches</TypographyKit>
          <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
          </TypographyKit>
          <div className="left-part-radio-wrapper">
            <RadioGroupKit
              aria-labelledby="demo-radio-buttons-group-label"
              value={platform}
              onChange={(e) => getPlatform(e)}
              name="radio-buttons-group">
              <MarketingRadio className="talabat" icon={talabat} title="talabat" />
              <MarketingRadio className="deliveroo" icon={deliveroo} title="deliveroo" />
            </RadioGroupKit>
          </div>
          <CompetitionDropdown
            rows={['1 branch', '2 branch']}
            icon={BranchesIcon}
            title="Select Branches"
            className="top-competition marketing-dropdown"
            setRow={setBranch}
            select={branch}
          />
        </div>
      );
    }
    if (platform === 'deliveroo') {
      if (selected === 2) {
        return (
          <div className="left-part-middle">
            <TypographyKit variant="h6">2.Select the Type of the offer</TypographyKit>
            <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
              Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
            </TypographyKit>
            <RadioGroupKit
              aria-labelledby="demo-radio-buttons-group-label"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              name="radio-buttons-group-menu">
              <BoxKit
                className={`left-part-radio under-textfields radio-dates ${
                  menu === 'Offer on the whole Menu' ? 'active' : ''
                }
                  `}>
                <div className="radio">
                  <div>
                    <span>
                      <img src={menuIcon} alt="Menu Icon" />
                    </span>
                    <div>
                      <div>Offer on the whole Menu</div>
                      <p>Ex : Lorme Ipsum 24%</p>
                    </div>
                  </div>
                  <FormControlLabelKit value="Offer on the whole Menu" control={<RadioKit />} />
                </div>
                <div style={{ width: '100%', marginTop: '0px' }}>
                  <div style={{ width: '100%' }}>
                    <div className="dropdown-wrapper">
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Procentage Discount
                          <MarketingPlaceholderDropdown
                            names={['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
                            title="%"
                            setPersonName={setDiscountPercentage}
                            personName={discountPercentage}
                          />
                        </TypographyKit>
                      </TypographyKit>
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Min Order Value
                          <MarketingPlaceholderDropdown
                            names={['0.0 AED', '10.0 AED', '20.0 AED', '30.0 AED']}
                            title="$0.00"
                            setPersonName={setMinOrder}
                            personName={minOrder}
                          />
                        </TypographyKit>
                      </TypographyKit>
                    </div>
                  </div>
                </div>
              </BoxKit>
              <BoxKit
                className={`left-part-radio under-textfields radio-dates ${
                  menu === 'Offer on An Item from the Menu' ? 'active' : ''
                }
                  `}>
                <div className="radio">
                  <div>
                    <span>
                      <img src={ItemMenuIcon} alt="Item Menu Icon" />
                    </span>
                    <div>
                      <div>Offer on An Item from the Menu</div>
                      <p>Ex : Lorme Ipsum 24%</p>
                    </div>
                  </div>
                  <FormControlLabelKit
                    value="Offer on An Item from the Menu"
                    control={<RadioKit />}
                  />
                </div>
                <div>
                  <RadioGroupKit
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={itemMenu}
                    onChange={(e) => setItemMenu(e.target.value)}
                    name="radio-buttons-group-menu">
                    {[
                      {
                        title: 'Flash Deal',
                        subtitle: 'Sell Off extra stock when you’re about to close',
                      },
                      {
                        title: 'Order more , save more',
                        subtitle: 'Attract larger orders from groupes and famillies',
                      },
                      { title: 'Restaurent Pick', subtitle: 'Promote new items or special dishes' },
                      { title: 'Free item', subtitle: 'Allow customers ro choose a free item' },
                    ].map((obj) => (
                      <MarketingRadio key={obj.title} title={obj.title} subtitle={obj.subtitle} />
                    ))}
                    <div className="dropdown-wrapper">
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Procentage Discount
                          <MarketingPlaceholderDropdown
                            names={['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
                            title="%"
                            setPersonName={setDiscountPercentage}
                            personName={discountPercentage}
                          />
                        </TypographyKit>
                      </TypographyKit>
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Min Order Value
                          <MarketingPlaceholderDropdown
                            names={['0.0 AED', '10.0 AED', '20.0 AED', '30.0 AED']}
                            title="$0.00"
                            setPersonName={setMinOrder}
                            personName={minOrder}
                          />
                        </TypographyKit>
                      </TypographyKit>
                    </div>
                  </RadioGroupKit>
                </div>
              </BoxKit>
            </RadioGroupKit>
          </div>
        );
      }
      if (menu === 'Offer on An Item from the Menu') {
        if (selected === 3) {
          return (
            <div className="left-part-middle">
              <TypographyKit variant="h6">3.Select the Duration</TypographyKit>
              <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
                Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
              </TypographyKit>
              <BoxKit
                className={`left-part-radio under-textfields radio-dates ${
                  menu === 'Offer on An Item from the Menu' ? 'active' : ''
                }
                  `}>
                <div className="radio">
                  <div>
                    <span>
                      <img src={ItemMenuIcon} alt="Item Menu Icon" />
                    </span>
                    <div>
                      <div>Offer on An Item from the Menu</div>
                      <p>{itemMenu}</p>
                    </div>
                  </div>
                </div>
                <div className="picker-duration search-filter">
                  <TextfieldKit
                    style={{ width: '100%' }}
                    id="input-with-icon-textfield"
                    placeholder="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={searchIcon} alt="Searh Icon" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                  <CompetitionDropdown
                    rows={['category 1', 'category 2']}
                    title="All Categories"
                    className="top-competition marketing-setup-dropdown w60"
                    setRow={setCategory}
                    select={category}
                  />
                </div>
              </BoxKit>
            </div>
          );
        }
      }
      if (menu === 'Offer on the whole Menu') {
        if (selected === 3) {
          return (
            <div className="left-part-middle">
              <TypographyKit variant="h6">3.Select the Duration</TypographyKit>
              <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
                Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
              </TypographyKit>
              <RadioGroupKit
                className="duration-wrapper"
                aria-labelledby="demo-radio-buttons-group-label"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                name="radio-buttons-group-duration">
                <BoxKit
                  className={`left-part-radio under-textfields radio-dates ${
                    duration === 'Starting Now' ? 'active' : ''
                  }`}>
                  <div className="radio">
                    <div>
                      <span>
                        <img src={CalendarCheckedIcon} alt="Calendar checked Icon" />
                      </span>
                      <div>
                        <div>Starting Now</div>
                        <p>{format(new Date(), 'dd MMM yyyy HH:00')}</p>
                      </div>
                    </div>
                    <FormControlLabelKit value="Starting Now" control={<RadioKit />} />
                  </div>
                  <div className="picker-duration">
                    <div>
                      Ending Date
                      <DatePickerDayKit
                        className="date-error"
                        minDate={new Date(addDays(new Date(), 1))}
                        value={endingDate}
                        onChange={(newValue) => {
                          onChange(newValue, setEndingDate);
                        }}
                        renderInput={(params) => <TextfieldKit {...params} />}
                      />
                    </div>
                    {times.map((obj, index) => (
                      <div key={obj.pos} className="picker-duration">
                        <div>
                          End Time
                          <BasicTimePicker
                            minTime={
                              new Date(
                                null,
                                null,
                                null,
                                format(addHours(new Date(obj.startTime), 1), 'HH', 0),
                              )
                            }
                            value={obj.endTime}
                            setValue={setTimes}
                            times={times}
                            index={index}
                            type="endTime"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </BoxKit>
                <BoxKit
                  className={`left-part-radio under-textfields ${
                    duration === 'Program the offer duration' ? 'active' : ''
                  }`}>
                  <div className="radio">
                    <div>
                      <span>
                        <img src={CalendarEventIcon} alt="Calendar Event Icon" />
                      </span>
                      <div>
                        <div>Program the offer duration</div>
                        <p>
                          {customDay || 'Recurrence customized'}
                          <img src={ArrowIcon} alt="arrow" />
                        </p>
                      </div>
                    </div>
                    <FormControlLabelKit
                      value="Program the offer duration"
                      control={<RadioKit />}
                    />
                  </div>
                  <div>
                    <RadioGroupKit
                      className="radio-group-day"
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={customDay}
                      onChange={(e) => setCustomDay(e.target.value)}
                      name="radio-buttons-group-days">
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
        }
        if (duration === 'Program the offer duration') {
          if (selected === 4) {
            if (customDay) {
              return (
                <div className="left-part-middle">
                  <TypographyKit variant="h6">4.Select the Recurrence detail</TypographyKit>
                  <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
                    Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
                  </TypographyKit>
                  <BoxKit className="left-part-radio under-textfields radio-dates active">
                    <div className="radio">
                      <div>
                        <span>
                          <img style={{ filter: 'none' }} src={TimerIcon} alt="Timer Icon" />
                        </span>
                        <div>
                          <div>Recurrence Details</div>
                          <p>{customDay}</p>
                        </div>
                      </div>
                    </div>
                    {customDay === 'Same day every week' ? (
                      <CompetitionDropdown
                        rows={[
                          'Every Monday',
                          'Every Tuesday',
                          'Every Wendensday',
                          'Every Thursday',
                          'Every Friday',
                          'Every Saturday',
                          'Every Sunday',
                        ]}
                        title={customDay}
                        className="top-competition marketing-setup-dropdown"
                        setRow={setEveryWeek}
                        select={everyWeek}
                      />
                    ) : (
                      ''
                    )}
                    {customDay === 'Customised Days' ? (
                      <MarketingCheckmarksDropdown
                        names={days}
                        setName={setCustomisedDay}
                        personName={customisedDay}
                      />
                    ) : (
                      ''
                    )}
                    <div className="picker-duration">
                      <div>
                        Starting Date
                        <DatePickerDayKit
                          className="date-error"
                          shouldDisableDate={customDay === 'Every Day' ? null : disableWeekends}
                          value={startingDate}
                          onChange={(newValue) => {
                            onChange(newValue, setStartingDate);
                          }}
                          renderInput={(params) => <TextfieldKit {...params} />}
                        />
                      </div>
                      <div>
                        Ending Date
                        <DatePickerDayKit
                          className="date-error"
                          shouldDisableDate={customDay === 'Every Day' ? null : disableWeekends}
                          minDate={new Date(addDays(startingDate, 1))}
                          value={endingDate}
                          onChange={(newValue) => {
                            onChange(newValue, setEndingDate);
                          }}
                          renderInput={(params) => <TextfieldKit {...params} />}
                        />
                      </div>
                    </div>
                    {times.map((obj, index) =>
                      times.length > 1 ? (
                        <div key={obj.pos} className="picker-duration">
                          <div>
                            Start Time {obj.pos}
                            <BasicTimePicker
                              value={obj.startTime}
                              minTime={
                                obj.pos === 1
                                  ? ''
                                  : new Date(
                                      null,
                                      null,
                                      null,
                                      format(addHours(times[index - 1].endTime, 1), 'HH'),
                                      0,
                                    )
                              }
                              setValue={setTimes}
                              times={times}
                              index={index}
                              type="startTime"
                            />
                          </div>
                          <div>
                            End Time {obj.pos}
                            <BasicTimePicker
                              value={obj.endTime}
                              minTime={
                                new Date(
                                  null,
                                  null,
                                  null,
                                  format(addHours(obj.startTime, 1), 'HH'),
                                  0,
                                )
                              }
                              setValue={setTimes}
                              times={times}
                              index={index}
                              type="endTime"
                            />
                          </div>
                          <div className="trash-wrapper">
                            <img
                              role="presentation"
                              tabIndex={-1}
                              onClick={() => {
                                times.splice(index, 1);
                                setTimes([...times]);
                              }}
                              src={trash}
                              alt="trash"
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={obj.pos} className="picker-duration">
                          <div>
                            Start Time
                            <BasicTimePicker
                              value={obj.startTime}
                              setValue={setTimes}
                              times={times}
                              index={index}
                              type="startTime"
                            />
                          </div>
                          <div>
                            End Time
                            <BasicTimePicker
                              minTime={new Date(addHours(new Date(obj.startTime), 1))}
                              value={obj.endTime}
                              setValue={setTimes}
                              times={times}
                              index={index}
                              type="endTime"
                            />
                          </div>
                        </div>
                      ),
                    )}
                    {customDay === 'Continues Offer' || times.length === 3 ? (
                      ''
                    ) : (
                      <ButtonKit
                        onClick={() =>
                          setTimes([
                            ...times,
                            {
                              startTime: new Date(null, null, null, format(new Date(), 'HH'), 0),
                              endTime: new Date(
                                null,
                                null,
                                null,
                                format(
                                  addHours(
                                    times.length === 1
                                      ? times[0].startTime
                                      : times[times.length - 2].endTime,
                                    1,
                                  ),
                                  'HH',
                                ),
                                0,
                              ),
                              pos: times.length + 1,
                            },
                          ])
                        }
                        className="another-slot"
                        variant="contained">
                        <img src={plus} alt="plus" />
                        Add Another Slot
                      </ButtonKit>
                    )}
                  </BoxKit>
                </div>
              );
            }
          }
          return '';
        }
      }

      return '';
    }
    return '';
  };
  function isValidDate(d) {
    return d instanceof Date && !Number.isNaN(d);
  }
  useEffect(() => {
    if (platform === 'deliveroo') {
      if (selected === 1) {
        setDisabled(!branch);
      }
      if (selected === 2) {
        if (menu === 'Offer on An Item from the Menu') {
          setSteps([0, 1, 2, 3, 4, 5]);
          setDisabled(!(menu && discountPercentage && minOrder && itemMenu));
        } else {
          setSteps([0, 1, 2, 3, 4]);
          setDisabled(!(menu && discountPercentage && minOrder));
        }
      }
      if (selected === 3) {
        if (duration === 'Program the offer duration') {
          setSteps([0, 1, 2, 3, 4, 5]);
          setDisabled(!customDay);
        } else {
          setSteps([0, 1, 2, 3, 4]);
          setDisabled(
            !(
              endingDate !== null &&
              disabledDate &&
              times.every(
                (obj) =>
                  isValidDate(obj.endTime) &&
                  obj.startTime !== null &&
                  !Number.isNaN(new Date(obj.endTime).getTime()),
              )
            ),
          );
        }
      }
      if (duration === 'Program the offer duration') {
        if (selected === 4) {
          if (customDay === 'Same day every week') {
            setDisabled(
              !(
                startingDate !== null &&
                endingDate !== null &&
                disabledDate &&
                everyWeek &&
                times.every(
                  (obj) =>
                    isValidDate(obj.endTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.endTime).getTime()) &&
                    isValidDate(obj.startTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.startTime).getTime()),
                )
              ),
            );
          }
          if (customDay === 'Customised Days') {
            setDisabled(
              !(
                startingDate !== null &&
                endingDate !== null &&
                disabledDate &&
                customisedDay.length > 0 &&
                times.every(
                  (obj) =>
                    isValidDate(obj.endTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.endTime).getTime()) &&
                    isValidDate(obj.startTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.startTime).getTime()),
                )
              ),
            );
          } else if (customDay !== 'Customised Day' && customDay !== 'Same day every week') {
            setDisabled(
              !(
                startingDate !== null &&
                endingDate !== null &&
                disabledDate &&
                times.every(
                  (obj) =>
                    isValidDate(obj.endTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.endTime).getTime()) &&
                    isValidDate(obj.startTime) &&
                    obj.startTime !== null &&
                    !Number.isNaN(new Date(obj.startTime).getTime()),
                )
              ),
            );
          }
        }
      }
    } else if (platform === 'talabat') {
      if (selected === 1) {
        setDisabled(!branch);
      }
      if (selected === 2) {
        setDisabled(!(menu && discountPercentage && minOrder));
      }
    }
  }, [
    menu,
    minOrder,
    branch,
    platform,
    discountPercentage,
    selected,
    duration,
    endingDate,
    customDay,
    disabledDate,
    times,
    everyWeek,
    customisedDay,
    itemMenu,
  ]);
  useEffect(() => {
    setTimes([
      {
        startTime: new Date(null, null, null, format(new Date(), 'HH'), 0),
        endTime: new Date(null, null, null, format(new Date(addHours(new Date(), 1)), 'HH'), 0),
        pos: 1,
      },
    ]);
  }, [customDay]);
  return (
    <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
      <PaperKit className="marketing-paper">
        <ContainerKit className="setup-container">
          <div className="left-part">
            <div>
              <div className="left-part-top">
                <div>
                  <TypographyKit variant="h4">Set up an offer</TypographyKit>

                  <img
                    tabIndex={-1}
                    role="presentation"
                    onClick={() => setActive(false)}
                    src={CloseIcon}
                    alt="close icon"
                  />
                </div>
                <MarketingSetupStepper selected={selected} steps={steps} />
              </div>
              {getProgress()}
            </div>
            <div className="left-part-bottom">
              <ButtonKit
                onClick={() => setSelected(selected - 1)}
                variant="outlined"
                disabled={!(selected >= 2)}>
                Previous Step
              </ButtonKit>
              <ButtonKit
                onClick={() => setSelected(selected + 1)}
                disabled={disabled}
                variant="contained">
                Next Step
              </ButtonKit>
            </div>
          </div>
          <div className="right-part">
            <div className="right-part-header">
              <TypographyKit
                className={`right-part-header_link ${links ? 'active' : ''}`}
                variant="div">
                <BoxKit className={!links ? 'active' : ''} onClick={() => setLinks(false)}>
                  <img src={RevenueHeatMapIcon} alt="Revenue Heat Map Icon" />
                  Revenue Heat Map
                </BoxKit>
                <BoxKit className={links ? 'active' : ''} onClick={() => setLinks(true)}>
                  <img src={PlatformIcon} alt="Order Heat Map Icon" />
                  Orders Heat Map
                </BoxKit>
              </TypographyKit>
              <Dates
                isMarketingHeatMap
                dateFromBtn={beforePeriodBtn}
                setdateFromBtn={setBeforePeriodBtn}
              />
            </div>
            <TypographyKit variant="div" className="right-part-main">
              <TypographyKit className="right-part-main-title" variant="div">
                <TypographyKit
                  variant="div"
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <TypographyKit variant="h6">Min Revenue this week</TypographyKit>
                  <TypographyKit variant="h6">Max Revenue this week</TypographyKit>
                </TypographyKit>
                <TypographyKit variant="div" className="color-btns">
                  <TypographyKit>&lt;1</TypographyKit>
                  <TypographyKit>&lt;30</TypographyKit>
                  <TypographyKit>&lt;50</TypographyKit>
                  <TypographyKit>&lt;$5,213.98</TypographyKit>
                </TypographyKit>
              </TypographyKit>
              <TypographyKit variant="div" sx={{ display: 'flex', margin: '30px 0' }}>
                <TypographyKit variant="div" className="right-part-main-hour">
                  <TypographyKit>
                    <img src={OpacityLogo} alt="Logo" />
                  </TypographyKit>
                  {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0].map(
                    (num) => (
                      <TypographyKit key={num}>
                        {num} <span>{num >= 12 ? 'PM' : 'AM'}</span>
                      </TypographyKit>
                    ),
                  )}
                </TypographyKit>
                <TypographyKit sx={{ width: '100%' }} variant="div">
                  <TypographyKit variant="div" className="right-part-main-day">
                    {days.map((day) => (
                      <TypographyKit key={day}>{day.slice(0, 3)}</TypographyKit>
                    ))}
                  </TypographyKit>
                  <TypographyKit className="right-part-main-heatmap" variant="div">
                    {Object.values(heatMap()).map((obj, index) => (
                      <TypographyKit key={Object.keys(obj)[index]} variant="div">
                        {Object.keys(obj).map((num, indexObj) => (
                          <TypographyKit
                            className="heatmap-btn"
                            sx={{
                              background: `${
                                obj[indexObj + 5].color ? obj[indexObj + 5].color : '#919EAB1F'
                              }`,
                            }}
                            key={num}>
                            {[24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39].map(
                              (n) => (
                                <span key={n}>
                                  <span style={{ '--i': n }} />
                                </span>
                              ),
                            )}
                          </TypographyKit>
                        ))}
                      </TypographyKit>
                    ))}
                  </TypographyKit>
                </TypographyKit>
              </TypographyKit>
            </TypographyKit>
          </div>
        </ContainerKit>
      </PaperKit>
    </div>
  );
};

export default MarketingSetup;
