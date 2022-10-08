import { format, startOfWeek } from 'date-fns';
import React, { useState, useEffect } from 'react';
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
import { OrderHeatMap } from '../../data/fakeDataMarketing';
import InputKit from '../../kits/input/InputKit';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import MarketingSetupStepper from '../marketingSetupStepper/MarketingSetupStepper';
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import RadioGroupKit from '../../kits/radioGroup/RadioGroupKit';
import BranchesIcon from '../../assets/images/ic_branch.png';
import menuIcon from '../../assets/images/ic_menu.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import BreakIcon from '../../assets/images/ic_break.png';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';
import RadioKit from '../../kits/radio/RadioKit';
import CalendarCheckedIcon from '../../assets/images/ic_calendar-checked.png';
import CalendarEventIcon from '../../assets/images/ic_calendar-event.png';

const MarketingSetup = ({ active, setActive }) => {
  const [branch, setBranch] = useState('');
  const [platform, setPlatform] = useState('talabat');
  const [selected, setSelected] = useState(1);
  const [discount, setDiscount] = useState('Percentage Discount');
  const [percentage, setPercentage] = useState(0);
  const [links, setLinks] = useState(false);
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [minOrder, setMinOrder] = useState(0);
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date()),
    endDate: new Date(),
  });
  const [steps, setSteps] = useState([0, 1, 2, 3]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatMap = () => {
    const data = OrderHeatMap.values;
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
    Object.keys(data).forEach((day) => {
      Object.keys(heatMapObj[day]).forEach((num) => {
        heatMapObj[day][num] = data[day][num] || {};
      });
    });
    return Object.values(heatMapObj);
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
                    <InputKit
                      onChange={(e) => setPercentage(e.target.value)}
                      type="number"
                      placeholder="Percentage Value %"
                      className="min-max-textfield"
                    />
                  </TypographyKit>
                </TypographyKit>
                <TypographyKit className="min-max-textfields" variant="div">
                  <TypographyKit variant="div">
                    <TypographyKit>Min Order</TypographyKit>
                    <InputKit
                      onChange={(e) => setMinOrder(e.target.value)}
                      type="number"
                      placeholder="$0.00"
                      className="min-max-textfield"
                    />
                  </TypographyKit>
                </TypographyKit>
              </BoxKit>
            </RadioGroupKit>
          </div>
        );
      }
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
            name="radio-buttons-group-discount">
            <BoxKit className="left-part-radio">
              <div>
                <span>
                  <img src={CalendarCheckedIcon} alt="Calendar checked Icon" />
                </span>
                <div>
                  <div>Starting Now</div>
                  <p>{format(new Date(), 'dd MMM yyyy HH:mm')}</p>
                </div>
              </div>
              <FormControlLabelKit value="Starting Now" control={<RadioKit />} />
            </BoxKit>
            <BoxKit className="left-part-radio">
              <div>
                <span>
                  <img src={CalendarEventIcon} alt="Calendar Event Icon" />
                </span>
                <div>
                  <div>Program the offer duration</div>
                  <p>Recurrence customized</p>
                </div>
              </div>
              <FormControlLabelKit value="Program the offer duration" control={<RadioKit />} />
            </BoxKit>
          </RadioGroupKit>
        </div>
      );
    }
    return '';
  };
  useEffect(() => {
    if (platform === 'deliveroo') {
      if (selected === 1) {
        setDisabled(!branch);
      }
      if (selected === 2) {
        setDisabled(!(menu && percentage > 0 && minOrder > 0));
      }
    } else if (platform === 'talabat') {
      if (selected === 1) {
        setDisabled(!branch);
      }
      if (selected === 2) {
        setDisabled(!(menu && percentage > 0 && minOrder > 0));
      }
    }
  }, [menu, minOrder, branch, platform, percentage]);
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
                      <TypographyKit key={day}>{day}</TypographyKit>
                    ))}
                  </TypographyKit>
                  <TypographyKit className="right-part-main-heatmap" variant="div">
                    {heatMap().map((obj, index) => (
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                              <span>
                                <span style={{ '--i': n }} key={n} />
                              </span>
                            ))}
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
