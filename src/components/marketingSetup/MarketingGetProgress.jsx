import { addDays, addHours, format, getHours } from 'date-fns';
import React from 'react';
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
import BasicTimePicker from '../timePicker/TimePicker';
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
import useDate from '../../hooks/useDate';
import BranchesIcon from '../../assets/images/ic_branch.png';

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
    getDiscountOrMov,
    categoryData,
    categoryDataList,
    filteredCategoryData,
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
    customDay,
    setCustomDay,
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
    if (customDay === 'Work Week') {
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
        onChange={(e) => setDuration(e.target.value)}
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
                <p>{format(addHours(new Date(), 1), 'dd MMM yyyy HH:00')}</p>
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
              name="radio-buttons-group-days"
            >
              {[
                'Continuous Offer',
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
  const audienceSelected = () => (
    <div className="left-part-middle">
      {platform === 'deliveroo' ? (
        <TypographyKit variant="h6">{selected}.Select your target audience</TypographyKit>
      ) : (
        ''
      )}
      <TypographyKit className="left-part-subtitle" color="#637381" variant="subtitle">
        Create and manage all your offers. Set personalised rules to automatically trigger your
        offers.
      </TypographyKit>
      {platform !== 'talabat' ? (
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
              {['All customers', 'New customer', 'Deliveroo plus'].map((day) => (
                <div key={day}>
                  <FormControlLabelKit value={day} control={<RadioKit />} />
                  <span>{day}</span>
                </div>
              ))}
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
        className="another-slot remove grey"
        variant="contained"
      >
        <img src={SmRuleIcon} alt="Sm Rule" />
        Combine with a smart rule
      </ButtonKit>
      <ButtonKit className="another-slot remove" variant="contained">
        <img src={SpeakerIcon} alt="Speaker" />
        Combine with an Ads
      </ButtonKit>
    </div>
  );
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
              <p>{customDay}</p>
            </div>
          </div>
        </div>
        {customDay === 'Same day every week' ? (
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
              shouldDisableDate={customDay === 'Work Week' ? disableWeekends : null}
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
              shouldDisableDate={customDay === 'Work Week' ? disableWeekends : null}
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
            <div key={obj.pos} className="picker-duration">
              <div>
                Start Time {obj.pos}
                <BasicTimePicker
                  value={obj.startTime}
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
        {customDay === 'Continuous Offer' || times.length === 3 ? (
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
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
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
              </div>
            </div>
          </BoxKit>
          {platform.length === 1 ? (
            <BoxKit
              className={`left-part-radio under-textfields radio-dates ${
                platformData === 'talabat' || category.length === 0 ? 'disabled' : ''
              } ${menu === 'Offer on An Item from the Menu' ? 'active' : ''}
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
                {platformData === 'deliveroo' && category.length > 0 ? (
                  <FormControlLabelKit
                    value="Offer on An Item from the Menu"
                    control={<RadioKit />}
                  />
                ) : (
                  ''
                )}
              </div>
              <div>
                <RadioGroupKit
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={itemMenu}
                  onChange={(e) => setItemMenu(e.target.value)}
                  name="radio-buttons-group-menu"
                >
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
                    { title: 'Free item', subtitle: 'Allow customers to choose a free item' },
                  ].map((obj) => (
                    <MarketingRadio key={obj.title} title={obj.title} subtitle={obj.subtitle} />
                  ))}
                  <div className="dropdown-wrapper">
                    <TypographyKit className="min-max-textfields" variant="div">
                      <TypographyKit variant="div">
                        Percentage Discount
                        <MarketingPlaceholderDropdown
                          names={getDiscountOrMov('discount')}
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
                          names={getDiscountOrMov('mov')}
                          title="0 AED"
                          setPersonName={setMinOrder}
                          personName={minOrder}
                        />
                      </TypographyKit>
                    </TypographyKit>
                  </div>
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
              menu === 'Offer on An Item from the Menu' ? 'active' : ''
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
              <div style={{ width: '90%' }}>
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
            <FormcontrolKit className="category-list">
              {(filteredCategoryData.length > 0 ? filteredCategoryData : category).map((obj) => (
                <MenuItemKit className="menu-item-wrapper" key={obj.id} value={obj.name}>
                  <div>
                    <CheckboxKit
                      onChange={({ target }) => {
                        if (target.checked) {
                          setChecked([...checked, obj.name]);
                        } else {
                          checked.splice(checked.indexOf(obj.name), 1);
                          setChecked([...checked]);
                        }
                      }}
                      checked={checked.indexOf(obj.name) > -1}
                    />
                    <ListItemTextKit primary={obj.name} />
                  </div>
                  <b>{obj.price} AED</b>
                </MenuItemKit>
              ))}
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
        return audienceSelected();
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 5) {
        if (customDay) {
          return reccurenceSelected();
        }
      }
      if (selected === 6) {
        return audienceSelected();
      }
    }
  }
  if (menu === 'Offer on the whole Menu') {
    if (selected === 3) {
      return durationSelected();
    }
    if (duration === 'Starting Now') {
      if (selected === 4) {
        return audienceSelected();
      }
    }
    if (duration === 'Program the offer duration') {
      if (selected === 4) {
        if (customDay) {
          return reccurenceSelected();
        }
      }
      if (selected === 5) {
        return audienceSelected();
      }
    }
  }
  return '';
};

export default GetProgress;
