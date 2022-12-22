import React, { useEffect, useState } from 'react';
import { addDays, addHours, addMinutes, format, getHours, isSameDay } from 'date-fns';
import { useAtom } from 'jotai';
import InputAdornment from '@mui/material/InputAdornment';
import MarketingRadio from './MarketingRadio';
import plus from '../../assets/images/plus.png';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './MarketingSetup.scss';
import BoxKit from '../../kits/box/BoxKit';
import CompetitionDropdown from '../competitionDropdown/CompetitionDropdown';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import MenuDropdown from '../settings/menu/menuDropdown/MenuDropdown';
import RadioGroupKit from '../../kits/radioGroup/RadioGroupKit';
import menuIcon from '../../assets/images/ic_menu.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';
import CalendarCheckedIcon from '../../assets/images/ic_calendar-checked.png';
import CalendarEventIcon from '../../assets/images/ic_calendar-event.png';
import DatePickerDayKit from '../../kits/datePicker/DatePickerDayKit';
import ArrowIcon from '../../assets/images/arrow.png';
import TimerIcon from '../../assets/images/ic_timer.png';
import AudienceIcon from '../../assets/images/ic_audience.png';
import { platformList, platformObject } from '../../data/platformList';
import trash from '../../assets/images/ic_trash.png';
import MarketingCheckmarksDropdown from './MarketingChecmarksDropdown';
import MarketingPlaceholderDropdown from './MarketingPlaceholderDropdown';
import searchIcon from '../../assets/images/ic_search.png';
import SmRuleIcon from '../../assets/images/ic_sm-rule.png';
import SpeakerIcon from '../../assets/images/ic_speaker.png';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import RestaurantDropdown from '../restaurantDropdown/RestaurantDropdown.suspended';
import BranchMarketingDropdown from '../branchMarketingDropdown/BranchMarketingDropdown';
import { vendorsAtom } from '../../store/vendorsAtom';
import BranchesIcon from '../../assets/images/ic_branch.png';
import TimePickerDropdown from '../timePicker/TimePickerDropdown';
import TooltipKit from '../../kits/toolTip/TooltipKit';

const TooltipCategory = ({ obj, index }) => {
  const textElement = document.querySelectorAll('.list-item-category')[index];
  const compareSize = () => {
    const compare = textElement?.children[0]?.scrollWidth > textElement?.children[0]?.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [],
  );

  const [hoverStatus, setHover] = useState(false);
  return (
    <div>
      <TooltipKit
        interactive={1}
        disableHoverListener={!hoverStatus}
        id="category-tooltip"
        title={obj.name}
      >
        <div>
          <ListItemTextKit className="list-item-category" primary={obj.name} />
        </div>
      </TooltipKit>
      <b>{obj.price} AED</b>
    </div>
  );
};
const GetProgress = ({ progressData }) => {
  const {
    selected,
    getPlatform,
    platform,
    handleCategoryDataChange,
    userPlatformData,
    setBranch,
    branch,
    menu,
    setMenu,
    setDiscountPercentage,
    discountPercentage,
    setMinOrder,
    minOrder,
    itemMenu,
    setItemMenu,
    getDiscountMovType,
    categoryData,
    categoryDataList,
    filteredCategoryData,
    setFilteredCategoryData,
    category,
    setChecked,
    checked,
    duration,
    setDuration,
    endingDate,
    onChange,
    setEndingDate,
    times,
    setTimes,
    typeSchedule,
    setTypeSchedule,
    targetAudience,
    setTargetAudience,
    setEveryWeek,
    everyWeek,
    days,
    setCustomisedDay,
    customisedDay,
    disableWeekends,
    startingDate,
    setStartingDate,
    setSmRule,
    setHeatmapData,
    heatmapData,
    links,
    getPlatformData,
    platformData,
    setBranchData,
    branchData,
  } = progressData;

  const getWorkWeek = () => {
    if (typeSchedule === 'Work Week') {
      if (new Date(endingDate).getDay() === 0) {
        return new Date(addDays(endingDate, 1));
      }
      if (new Date(endingDate).getDay() === 6) {
        return new Date(addDays(endingDate, 2));
      }
      return endingDate;
    }
    return endingDate;
  };

  const isEndingLimited = () => {
    if (isSameDay(new Date(endingDate), new Date(startingDate))) {
      return true;
    }

    return typeSchedule !== 'Continues Offer';
  };
  const durationSelected = () => (
    <div className="left-part-middle">
      <TypographyKit variant="h6">{selected}. Select the Duration</TypographyKit>
      <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
        Create and manage all your offers. Set personalised rules to automatically trigger your
        offers.
      </TypographyKit>
      <RadioGroupKit
        className="duration-wrapper"
        aria-labelledby="demo-radio-buttons-group-label"
        value={duration}
        onChange={(e) => {
          setDuration(e.target.value);
        }}
        name="radio-buttons-group-duration"
      >
        <BoxKit
          className={`left-part-radio under-textfields radio-dates ${
            duration === 'Starting Now' ? 'active' : ''
          }`}
        >
          <div className="radio">
            <div>
              <span>
                <img src={CalendarCheckedIcon} alt="Calendar checked Icon" />
              </span>
              <div>
                <div>Starting Now</div>
                <p>{format(addMinutes(new Date(), 2), 'dd MMM yyyy HH:mm')}</p>
              </div>
            </div>
            <FormControlLabelKit value="Starting Now" control={<RadioKit />} />
          </div>
          <div
            className="picker-duration"
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
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
              <div key={obj.pos} className="picker-duration" style={{ width: '100%' }}>
                <div style={{ width: '100%' }}>
                  End Time
                  <TimePickerDropdown
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
          }`}
        >
          <div className="radio">
            <div>
              <span>
                <img src={CalendarEventIcon} alt="Calendar Event Icon" />
              </span>
              <div>
                <div>Program the offer duration</div>
                <p>
                  {typeSchedule || 'Recurrence customized'}
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
              value={typeSchedule}
              onChange={(e) => setTypeSchedule(e.target.value)}
              name="radio-buttons-group-days"
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
  const audienceSelected = (plat) => (
    <div className="left-part-middle">
      {plat === 'deliveroo' ? (
        <TypographyKit variant="h6">{selected}.Select your target audience</TypographyKit>
      ) : (
        ''
      )}
      <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
        Create and manage all your offers. Set personalised rules to automatically trigger your
        offers.
      </TypographyKit>
      {plat === 'deliveroo' ? (
        <BoxKit className="left-part-radio under-textfields active">
          <div className="radio">
            <div>
              <span>
                <img style={{ filter: 'none' }} src={AudienceIcon} alt="Audience Icon" />
              </span>
              <div>
                <div>Target Audience</div>
              </div>
            </div>
          </div>
          <div>
            <RadioGroupKit
              className="radio-group-day"
              aria-labelledby="demo-radio-buttons-group-label"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              name="radio-buttons-group-days"
            >
              {['All customers', 'New customer', 'Deliveroo plus', 'Inactive customers'].map(
                (day) => (
                  <div key={day}>
                    <FormControlLabelKit value={day} control={<RadioKit />} />
                    <span>{day}</span>
                  </div>
                ),
              )}
            </RadioGroupKit>
          </div>
        </BoxKit>
      ) : (
        ''
      )}
      <ButtonKit
        onClick={() => {
          setSmRule(true);
        }}
        className="another-slot remove"
        variant="contained"
      >
        <img src={SmRuleIcon} alt="Sm Rule" />
        Combine with a smart rule
      </ButtonKit>
      <ButtonKit disabled className="another-slot remove" variant="contained">
        <img src={SpeakerIcon} alt="Speaker" />
        Combine with Ads
      </ButtonKit>
    </div>
  );
  const getAudience = () => {
    if (Object.keys(display).length > 0) {
      if (platform.length < 2) {
        return audienceSelected(platform[0]);
      }
      return audienceSelected('deliveroo');
    }
    return audienceSelected(platformData);
  };
  const reccurenceSelected = () => (
    <div className="left-part-middle">
      <TypographyKit variant="h6">{selected}. Select the Recurrence detail</TypographyKit>
      <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
        Create and manage all your offers. Set personalised rules to automatically trigger your
        offers.
      </TypographyKit>
      <BoxKit className="left-part-radio under-textfields radio-dates active">
        <div className="radio">
          <div>
            <span>
              <img style={{ filter: 'none' }} src={TimerIcon} alt="Timer Icon" />
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
              'Every Wendnesday',
              'Every Thursday',
              'Every Friday',
              'Every Saturday',
              'Every Sunday',
            ]}
            title={typeSchedule}
            className="top-competition marketing-setup-dropdown"
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
        <div className="picker-duration">
          <div>
            Starting Date
            <DatePickerDayKit
              className="date-error"
              shouldDisableDate={typeSchedule === 'Work Week' ? disableWeekends : null}
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
        {times.map((obj, index) =>
          times.length > 1 ? (
            <div
              key={obj.pos}
              className="picker-duration"
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ width: '100%' }}>
                Start Time {obj.pos}
                <TimePickerDropdown
                  startLimit={index === 0 ? null : times[index - 1].endTime}
                  value={obj.startTime}
                  setValue={setTimes}
                  times={times}
                  index={index}
                  type="startTime"
                />
              </div>
              <div style={{ width: '100%' }}>
                End Time {obj.pos}
                <TimePickerDropdown
                  startLimit={isEndingLimited() ? obj.startTime : null}
                  value={obj.endTime}
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
                    Object.values(heatmapData[links]).forEach((objHeat) => {
                      Object.keys(objHeat).forEach((num) => {
                        if (num === getHours(obj.startTime)) {
                          if (objHeat[num].active) {
                            delete heatmapData[links][new Date(startingDate).getDay() - 1][num];
                            setHeatmapData({ ...heatmapData });
                          }
                        }
                      });
                    });
                  }}
                  src={trash}
                  alt="trash"
                />
              </div>
            </div>
          ) : (
            <div
              key={obj.pos}
              className="picker-duration"
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ width: '100%' }}>
                Start Time
                <TimePickerDropdown
                  startLimit={index === 0 ? null : times[index - 1].endTime}
                  value={obj.startTime}
                  setValue={setTimes}
                  times={times}
                  index={index}
                  type="startTime"
                />
              </div>
              <div style={{ width: '100%' }}>
                End Time
                <TimePickerDropdown
                  startLimit={isEndingLimited() ? obj.startTime : null}
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
                    format(addHours(times[times.length - 1].endTime, 1), 'HH'),
                    0,
                  ),
                  endTime: new Date(
                    null,
                    null,
                    null,
                    format(addHours(times[times.length - 1].endTime, 1), 'HH'),
                    0,
                  ),
                  pos: times[times.length - 1].pos + 1,
                },
              ])
            }
            className="another-slot"
            variant="contained"
          >
            <img src={plus} alt="plus" />
            Add Another Slot
          </ButtonKit>
        )}
      </BoxKit>
    </div>
  );
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj, display } = vendors;

  const getMenuActive = () => {
    if (category === null) {
      return true;
    }
    if (Object.keys(display).length === 0) {
      return platformData === 'talabat' || category.length === 0;
    }
    if (platform.length < 2) {
      return platform[0] === 'talabat' || category.length === 0;
    }
    return false;
  };
  const itemMenuArr = [
    {
      title: 'Flash Deal',
      subtitle: 'Sell Off extra stock when you’re about to close',
    },
    {
      title: 'Order more , save more',
      subtitle: 'Attract larger orders from groupes and famillies',
    },
    { title: 'Restaurent Pick', subtitle: 'Promote new items or special dishes' },
    { title: 'Free Items', subtitle: 'Allow customers to choose a free items' },
  ];

  const catergorySearch = (e) => {
    const { value } = e.target;
    if (value === '') {
      setFilteredCategoryData([]);
      return;
    }
    const filtered = (filteredCategoryData.length > 0 ? filteredCategoryData : category).filter(
      (obj) => obj.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredCategoryData(filtered);
  };
  const [menuChanged, setMenuChanged] = useState('');
  useEffect(() => {
    setDiscountPercentage('');
    setMinOrder('');
    setMenuChanged(menu);
  }, [menu, itemMenu]);
  if (selected === 1) {
    return (
      <div className="left-part-middle">
        <TypographyKit variant="h6">{selected}. Select platform and branches</TypographyKit>
        <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
          Create and manage all your offers. Set personalised rules to automatically trigger your
          offers.
        </TypographyKit>
        <div className="left-part-radio-wrapper">
          {Object.keys(branch.display).length > 0 ? (
            <RadioGroupKit
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value=""
            >
              {platformList
                .filter((pf) => userPlatformData.platforms[pf.name].active)
                .map((p) => (
                  <MarketingRadio
                    setState={getPlatform}
                    state={platform}
                    checkbox
                    key={p.name}
                    className={p.name}
                    icon={p.src}
                    title={p.name}
                  />
                ))}
            </RadioGroupKit>
          ) : (
            <RadioGroupKit
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(e) => getPlatformData(e)}
              value={platformData || ''}
            >
              {platformList
                .filter((pf) => userPlatformData.platforms[pf.name].active)
                .map((p) => (
                  <MarketingRadio
                    state={platformData}
                    key={p.name}
                    className={p.name}
                    icon={p.src}
                    title={p.name}
                  />
                ))}
            </RadioGroupKit>
          )}
        </div>
        {Object.keys(branch.display).length > 0 ? (
          <RestaurantDropdown
            platforms={platform}
            chainObj={branch.chainObj}
            branch
            setState={setBranch}
            state={branch}
          />
        ) : (
          <BranchMarketingDropdown
            rows={vendorsObj[platformData]}
            icon={BranchesIcon}
            title="Select Branches"
            className="top-competition marketing-dropdown"
            setRow={setBranchData}
            select={branchData}
            platformData={platformObject[platformData]}
          />
        )}
      </div>
    );
  }
  if (selected === 2) {
    return (
      <div className="left-part-middle">
        <TypographyKit variant="h6">{selected}. Select the Type of the offer</TypographyKit>
        <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
          Create and manage all your offers. Set personalised rules to automatically trigger your
          offers.
        </TypographyKit>
        <RadioGroupKit
          aria-labelledby="demo-radio-buttons-group-label"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          name="radio-buttons-group-menu"
        >
          <BoxKit
            className={`left-part-radio under-textfields radio-dates ${
              menu === 'Offer on the whole Menu' ? 'active' : ''
            }
                  `}
          >
            <div className="radio">
              <div>
                <span>
                  <img src={menuIcon} alt="Menu Icon" />
                </span>
                <div>
                  <div>Discount on the whole Menu</div>
                  <p>Ex :&nbsp; -20% on the full menu</p>
                </div>
              </div>
              <FormControlLabelKit value="Offer on the whole Menu" control={<RadioKit />} />
            </div>
            <div style={{ width: '100%', marginTop: '0px' }}>
              <div style={{ width: '100%' }}>
                {menuChanged === 'Offer on the whole Menu' ? (
                  <div className="dropdown-wrapper">
                    <TypographyKit className="min-max-textfields" variant="div">
                      <TypographyKit variant="div">
                        Percentage Discount
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
                        Min. Order Value
                        <MarketingPlaceholderDropdown
                          names={['0 AED', '10 AED', '20 AED', '30 AED']}
                          title="0 AED"
                          setPersonName={setMinOrder}
                          personName={minOrder}
                        />
                      </TypographyKit>
                    </TypographyKit>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </BoxKit>
          {platform.length === 1 ? (
            <BoxKit
              className={`left-part-radio under-textfields radio-dates ${
                getMenuActive() ? 'disabled' : ''
              } ${menuChanged === 'Offer on An Item from the Menu' ? 'active' : ''}
                  `}
            >
              <div className="radio">
                <div>
                  <span>
                    <img src={ItemMenuIcon} alt="Item Menu Icon" />
                  </span>
                  <div>
                    <div>Offer on An Item from the Menu</div>
                    <p>Ex :&nbsp; -20% on the full menu</p>
                  </div>
                </div>
                {getMenuActive() ? (
                  ''
                ) : (
                  <FormControlLabelKit
                    value="Offer on An Item from the Menu"
                    control={<RadioKit />}
                  />
                )}
              </div>
              <div>
                <RadioGroupKit
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={itemMenu}
                  onChange={(e) => setItemMenu(e.target.value)}
                  name="radio-buttons-group-menu"
                >
                  {itemMenuArr.map((obj) => (
                    <MarketingRadio key={obj.title} title={obj.title} subtitle={obj.subtitle} />
                  ))}
                  {menuChanged === 'Offer on An Item from the Menu' ? (
                    <div className="dropdown-wrapper">
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Percentage Discount
                          <MarketingPlaceholderDropdown
                            names={getDiscountMovType('discount')}
                            title="%"
                            setPersonName={setDiscountPercentage}
                            personName={discountPercentage}
                          />
                        </TypographyKit>
                      </TypographyKit>
                      <TypographyKit className="min-max-textfields" variant="div">
                        <TypographyKit variant="div">
                          Min. Order Value
                          <MarketingPlaceholderDropdown
                            names={getDiscountMovType('mov')}
                            title="0 AED"
                            setPersonName={setMinOrder}
                            personName={minOrder}
                          />
                        </TypographyKit>
                      </TypographyKit>
                    </div>
                  ) : (
                    ''
                  )}
                </RadioGroupKit>
              </div>
            </BoxKit>
          ) : (
            ''
          )}
        </RadioGroupKit>
      </div>
    );
  }
  if (menu === 'Offer on An Item from the Menu') {
    if (selected === 3) {
      return (
        <div className="left-part-middle">
          <TypographyKit variant="h6">{selected}. Select the discounted items</TypographyKit>
          <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
            Create and manage all your offers. Set personalised rules to automatically trigger your
            offers.
          </TypographyKit>
          <BoxKit
            className={`left-part-radio under-textfields radio-dates ${
              menuChanged === 'Offer on An Item from the Menu' ? 'active' : ''
            }
                  `}
          >
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
              <div>
                <TextfieldKit
                  style={{ width: '45%' }}
                  id="input-with-icon-textfield"
                  placeholder="Search"
                  onChange={catergorySearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={searchIcon} alt="Searh Icon" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                <div style={{ width: '55%' }}>
                  <div className="__select menu-item-select">
                    <MenuDropdown
                      onChange={handleCategoryDataChange}
                      value={categoryData}
                      multiple
                      renderValue={(selectedMenu) => selectedMenu.join(', ')}
                      items={categoryDataList}
                      label="All Categories"
                      renderOption={(v) => (
                        <MenuItemKit key={v} value={v}>
                          <CheckboxKit checked={categoryData.indexOf(v) > -1} />
                          <ListItemTextKit primary={v} />
                        </MenuItemKit>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="max-amount">
                <p>Maximum amount: 10</p>
                <div>
                  Selected: <span>{checked.length}</span>
                </div>
              </div>
            </div>
            <FormcontrolKit className="category-list">
              {(filteredCategoryData.length > 0 ? filteredCategoryData : category).map(
                (obj, index) => (
                  <div className="menu-item-wrapper" key={obj.id} value={obj.name}>
                    <FormControlLabelKit
                      control={
                        <CheckboxKit
                          onChange={({ target }) => {
                            if (target.checked && checked.length < 10) {
                              setChecked([...checked, target.value]);
                            } else if (!target.checked) {
                              checked.splice(checked.indexOf(target.value), 1);
                              setChecked([...checked]);
                            }
                          }}
                          checked={checked.indexOf(obj.name) > -1}
                          value={obj.name}
                        />
                      }
                      label={<TooltipCategory index={index} obj={obj} />}
                    />
                  </div>
                ),
              )}
            </FormcontrolKit>
          </BoxKit>
        </div>
      );
    }
    if (selected === 4) {
      return durationSelected();
    }
    if (duration === 'Starting Now') {
      if (selected === 5) {
        return getAudience();
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 5) {
        if (typeSchedule) {
          return reccurenceSelected();
        }
      }
      if (selected === 6) {
        return getAudience();
      }
    }
  }
  if (menu === 'Offer on the whole Menu') {
    if (selected === 3) {
      return durationSelected();
    }
    if (duration === 'Starting Now') {
      if (selected === 4) {
        return getAudience();
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 4) {
        if (typeSchedule) {
          return reccurenceSelected();
        }
      }
      if (selected === 5) {
        return getAudience();
      }
    }
  }
  return '';
};

export default GetProgress;
