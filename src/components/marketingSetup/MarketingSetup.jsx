import { format, startOfWeek } from 'date-fns';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Tooltip } from '@mui/material';
import MarketingRadio from './MarketingRadio';
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
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { useGlobal } from '../../hooks/useGlobal';
import { usePlatform } from '../../hooks/usePlatform';
import TextfieldKit from '../../kits/textfield/TextfieldKit';

import MarketingSetupStepper from '../marketingSetupStepper/MarketingSetupStepper';
import RadioGroupKit from '../../kits/radioGroup/RadioGroupKit';
import BranchesIcon from '../../assets/images/ic_branch.png';
import menuIcon from '../../assets/images/ic_menu.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import BreakIcon from '../../assets/images/ic_break.png';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';
import CalendarCheckedIcon from '../../assets/images/ic_calendar-checked.png';
import CalendarEventIcon from '../../assets/images/ic_calendar-event.png';
import BasicTimePicker from '../timePicker/TimePicker';
import DatePickerDayKit from '../../kits/datePicker/DatePickerDayKit';
import ArrowIcon from '../../assets/images/arrow.png';
import TimerIcon from '../../assets/images/ic_timer.png';
import { platformList, platformObject } from '../../data/platformList';
import BranchMarketingDropdown from '../branchMarketingDropdown/BranchMarketingDropdown';

const defaultHeatmapState = {
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
};

const defaultRangeColorIndices = [0, 0, 0, 0];

const MarketingSetup = ({ active, setActive }) => {
  const [branch, setBranch] = useState('');
  const { userPlatformData } = usePlatform();
  const [platform, setPlatform] = useState(
    userPlatformData.platforms.talabat.active ? 'talabat' : 'deliveroo',
  );
  const [selected, setSelected] = useState(1);
  const [discount, setDiscount] = useState('Percentage Discount');
  const [links, setLinks] = useState('revenue');
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date()),
    endDate: new Date(),
  });
  const [heatmapData, setHeatmapData] = useState({
    revenue: defaultHeatmapState,
    orders: defaultHeatmapState,
  });
  const [rangeColorIndices, setRangeColorIndices] = useState({
    revenue: defaultRangeColorIndices,
    orders: defaultRangeColorIndices,
  });
  const { getHeatmap } = useApi();
  const { user } = useUserAuth();
  const { vendorsContext } = useGlobal();
  const [startingDate, setStartingDate] = useState();
  const [startingHour, setStartingHour] = useState();
  const [endingDate, setEndingDate] = useState(new Date());
  const [endingHour, setEndingHour] = useState(
    new Date(null, null, null, format(new Date(), 'HH'), 0),
  );
  const [customDay, setCustomDay] = useState('');

  const [steps, setSteps] = useState([0, 1, 2, 3]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const heatMapFormatter = (type) => {
    const tmpData = defaultHeatmapState;

    Object.keys(defaultHeatmapState).forEach((day) => {
      for (let i = 5; i < 25; i++) {
        tmpData[day][i] = heatmapData[type][day] ? heatmapData[type][day][i] || {} : {};
      }
    });
    return Object.values(tmpData);
  };

  const getHeatmapData = () => {
    const body = {
      master_email: user.email,
      access_token: user.accessToken,
      start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
      colors: ['#EDE7FF', '#CAB8FF', '#906BFF', '#7E5BE5'],
      vendors: vendorsContext,
    };

    Promise.all([getHeatmap('revenue', body), getHeatmap('orders', body)]).then(
      ([resRevenue, resOrders]) => {
        const initialisationStateRevenue = resRevenue.data.all
          ? resRevenue.data.all.heatmap
          : defaultHeatmapState;
        const initialisationStateOrders = resOrders.data.all
          ? resOrders.data.all.heatmap
          : defaultHeatmapState;

        const initialisationRangeColorIndicesRevenue = resRevenue.data.all
          ? resRevenue.data.all.ranges
          : defaultRangeColorIndices;
        const initialisationRangeColorIndicesOrders = resOrders.data.all
          ? resOrders.data.all.ranges
          : defaultRangeColorIndices;

        setHeatmapData({ revenue: initialisationStateRevenue, orders: initialisationStateOrders });
        setRangeColorIndices({
          revenue: initialisationRangeColorIndicesRevenue,
          orders: initialisationRangeColorIndicesOrders,
        });
      },
    );
  };

  useEffect(() => {
    getHeatmapData();
  }, [JSON.stringify(beforePeriodBtn)]);

  const getPlatform = (e) => {
    const { value } = e.target;
    setPlatform(value);
    if (value === 'talabat') {
      setSteps([0, 1, 2, 3]);
    } else {
      setSteps([0, 1, 2, 3, 4]);
    }
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
              {platformList
                .filter((pf) => userPlatformData.platforms[pf.name].active)
                .map((p) => (
                  <MarketingRadio key={p.name} className={p.name} icon={p.src} title={p.name} />
                ))}
            </RadioGroupKit>
          </div>
          <BranchMarketingDropdown
            rows={vendorsContext[platform]}
            icon={BranchesIcon}
            title="Select Branches"
            className="top-competition marketing-dropdown"
            setRow={setBranch}
            select={branch}
            platformData={platformObject[platform]}
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
              <MarketingRadio
                icon={menuIcon}
                title="Offer on the whole Menu"
                subtitle="Ex : Lorme Ipsum 24%"
              />
              <MarketingRadio
                disabled
                icon={ItemMenuIcon}
                title="Offer on An Item from the Menu"
                subtitle="Ex : Lorme Ipsum 24%"
              />
            </RadioGroupKit>
            <RadioGroupKit
              aria-labelledby="demo-radio-buttons-group-label"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              name="radio-buttons-group-discount">
              <BoxKit className="left-part-radio under-textfields">
                <div className="radio">
                  <div>
                    <span>
                      <img src={BreakIcon} alt="Box Icon" />
                    </span>
                    <div>Percentage Discount</div>
                  </div>
                  <FormControlLabelKit value="Percentage Discount" control={<RadioKit />} />
                </div>
                <TypographyKit className="min-max-textfields" variant="div">
                  <TypographyKit variant="div">
                    <CompetitionDropdown
                      rows={['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
                      title="Percentage Value %"
                      className="top-competition marketing-dropdown"
                      setRow={setDiscountPercentage}
                      select={discountPercentage}
                    />
                  </TypographyKit>
                </TypographyKit>
                <TypographyKit className="min-max-textfields" variant="div">
                  <TypographyKit variant="div">
                    <CompetitionDropdown
                      rows={['0.0 AED', '10.0 AED', '20.0 AED', '30.0 AED']}
                      title="Min Order"
                      className="top-competition marketing-dropdown"
                      setRow={setMinOrder}
                      select={minOrder}
                    />
                  </TypographyKit>
                </TypographyKit>
              </BoxKit>
            </RadioGroupKit>
          </div>
        );
      }
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
                      minDate={new Date()}
                      value={endingDate}
                      onChange={(newValue) => {
                        setEndingDate(newValue);
                      }}
                      renderInput={(params) => <TextfieldKit {...params} />}
                    />
                  </div>
                  <div className="hour-picker">
                    Ending Hour
                    <BasicTimePicker
                      minTime={new Date(null, null, null, format(new Date(), 'HH'), 0)}
                      value={endingHour}
                      setValue={setEndingHour}
                    />
                  </div>
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
                  <FormControlLabelKit value="Program the offer duration" control={<RadioKit />} />
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
          if (customDay === 'Continues Offer') {
            const getEndValue = () => {
              if (new Date(endingDate).toDateString() === new Date(startingDate).toDateString()) {
                if (
                  new Date(null, null, null, format(endingHour, 'HH'), 0).toISOString() >=
                  new Date(null, null, null, format(startingHour, 'HH'), 0).toISOString()
                ) {
                  return startingHour;
                }
                return endingHour;
              }
              return endingHour;
            };
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
                        <img src={TimerIcon} alt="Timer Icon" />
                      </span>
                      <div>
                        <div>Recurrence Details</div>
                        <p>{customDay}</p>
                      </div>
                    </div>
                  </div>
                  <div className="picker-duration">
                    <div>
                      Starting Date
                      <DatePickerDayKit
                        value={startingDate}
                        onChange={(newValue) => {
                          setStartingDate(newValue);
                        }}
                        renderInput={(params) => <TextfieldKit {...params} />}
                      />
                    </div>
                    <div>
                      Ending Date
                      <DatePickerDayKit
                        minDate={startingDate}
                        value={endingDate}
                        onChange={(newValue) => {
                          setEndingDate(newValue);
                        }}
                        renderInput={(params) => <TextfieldKit {...params} />}
                      />
                    </div>
                  </div>
                  <div className="picker-duration">
                    <div>
                      Start Time
                      <BasicTimePicker value={startingHour} setValue={setStartingHour} />
                    </div>
                    <div>
                      End Time
                      <BasicTimePicker
                        minTime={
                          new Date(endingDate).toDateString() ===
                          new Date(startingDate).toDateString()
                            ? new Date(
                                null,
                                null,
                                null,
                                format(
                                  !(
                                    startingHour !== null &&
                                    !Number.isNaN(new Date(startingHour).getTime()) &&
                                    isValidDate(startingHour)
                                  )
                                    ? new Date()
                                    : startingHour,
                                  'HH',
                                ),
                                0,
                              )
                            : null
                        }
                        value={getEndValue()}
                        setValue={setEndingHour}
                      />
                    </div>
                  </div>
                </BoxKit>
              </div>
            );
          }
        }
        return '';
      }
      return '';
    }
    return '';
  };
  function isValidDate(d) {
    return d instanceof Date && !Number.isNaN(d);
  }

  const renderHeatmapBox = () =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
      <span key={n}>
        <span style={{ '--i': n }} key={n} />
      </span>
    ));

  useEffect(() => {
    if (platform === 'deliveroo') {
      if (selected === 1) {
        setDisabled(!branch);
      }
      if (selected === 2) {
        setDisabled(!(menu && discountPercentage && minOrder));
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
              !Number.isNaN(new Date(endingDate).getTime()) &&
              isValidDate(endingDate) &&
              new Date(endingDate).toISOString() >= new Date().toISOString().slice(0, 10) &&
              endingHour !== null &&
              !Number.isNaN(new Date(endingHour).getTime()) &&
              isValidDate(endingHour) &&
              new Date(null, null, null, format(endingHour, 'HH'), 0).toISOString() >=
                new Date(null, null, null, format(new Date(), 'HH'), 0).toISOString()
            ),
          );
        }
      }
      if (duration === 'Program the offer duration') {
        if (selected === 4) {
          if (customDay === 'Continues Offer') {
            setDisabled(
              !(
                endingDate !== null &&
                !Number.isNaN(new Date(endingDate).getTime()) &&
                isValidDate(endingDate) &&
                new Date(endingDate).toISOString() >= new Date().toISOString().slice(0, 10) &&
                endingHour !== null &&
                !Number.isNaN(new Date(endingHour).getTime()) &&
                isValidDate(endingHour) &&
                new Date(null, null, null, format(endingHour, 'HH'), 0).toISOString() >=
                  new Date(null, null, null, format(startingHour, 'HH'), 0).toISOString() &&
                startingDate !== null &&
                !Number.isNaN(new Date(startingDate).getTime()) &&
                isValidDate(startingDate) &&
                startingHour !== null &&
                !Number.isNaN(new Date(startingHour).getTime()) &&
                isValidDate(startingHour)
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
    endingHour,
    customDay,
  ]);
  useEffect(() => {
    if (selected === 3) {
      setStartingDate(new Date());
      setStartingHour(new Date(null, null, null, format(new Date(), 'HH'), 0));
    }
    if (selected === 4) {
      setStartingDate(new Date());
      setStartingHour(new Date(null, null, null, format(new Date(), 'HH'), 0));
      setEndingDate(new Date());
      setEndingHour(new Date(null, null, null, format(new Date(), 'HH'), 0));
    }
  }, [selected]);

  const renderTooltipContent = (data) => (
    <div className="heatmap-tooltip">
      <div className="heatmap-tooltip__item">
        <span className="__item-text">total daily revenue till slot</span>
        <span className="__item-value">{data.x_accrued_intra_day}&nbsp;AED</span>
      </div>
      <div className="heatmap-tooltip__item">
        <span className="__item-text">Weekly total revenue of slot</span>
        <span className="__item-value">{data.x_slot_across_week}&nbsp;AED</span>
      </div>
      <div className="heatmap-tooltip__item">
        <span className="__item-text">% of daily revenue </span>
        <span className="__item-value">{data.x_percentage_intra_day * 100}&nbsp;%</span>
      </div>
    </div>
  );

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
                className={`right-part-header_link ${links === 'orders' ? 'active' : ''}`}
                variant="div">
                <BoxKit
                  className={links === 'revenue' ? 'active' : ''}
                  onClick={() => setLinks('revenue')}>
                  <img src={RevenueHeatMapIcon} alt="Revenue Heat Map Icon" />
                  Revenue Heat Map
                </BoxKit>
                <BoxKit
                  className={links === 'orders' ? 'active' : ''}
                  onClick={() => setLinks('orders')}>
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
                  <TypographyKit variant="h6">
                    Min {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD')}
                  </TypographyKit>
                  <TypographyKit variant="h6">
                    Max {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD')}
                  </TypographyKit>
                </TypographyKit>
                <TypographyKit variant="div" className="color-btns">
                  {rangeColorIndices[links].map((r) => (
                    <TypographyKit>&lt;{r}</TypographyKit>
                  ))}
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
                      <TypographyKit key={day}>{day}</TypographyKit>
                    ))}
                  </TypographyKit>
                  <TypographyKit className="right-part-main-heatmap" variant="div">
                    {heatMapFormatter(links).map((obj, index) => (
                      <TypographyKit key={Object.keys(obj)[index]} variant="div">
                        {Object.keys(obj).map((num, indexObj) => {
                          if (!obj[indexObj + 5].color)
                            return (
                              <TypographyKit
                                className="heatmap-btn"
                                key={num}
                                sx={{ background: '#919EAB1F' }}>
                                {renderHeatmapBox()}
                              </TypographyKit>
                            );

                          return (
                            <Tooltip
                              title={renderTooltipContent(obj[indexObj + 5].data)}
                              key={num}
                              arrow>
                              <ItemHeatmap>
                                <TypographyKit
                                  className="heatmap-btn"
                                  sx={{ background: obj[indexObj + 5].color }}>
                                  {renderHeatmapBox()}
                                </TypographyKit>
                              </ItemHeatmap>
                            </Tooltip>
                          );
                        })}
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

const ItemHeatmap = React.forwardRef((props, ref) => <div {...props} ref={ref} />);

export default MarketingSetup;
