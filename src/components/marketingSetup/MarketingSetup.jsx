import { startOfWeek } from 'date-fns';
import React, { useState, useEffect } from 'react';
import CloseIcon from '../../assets/images/ic_close.png';
import Dates from '../dates/Dates';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './MarketingSetup.scss';
import PaperKit from '../../kits/paper/PaperKit';
import ContainerKit from '../../kits/container/ContainerKit';
import BoxKit from '../../kits/box/BoxKit';
import LinearProgressKit from '../../kits/linearProgress/LinearProgressKit';
import CompetitionDropdown from '../competitionDropdown/CompetitionDropdown';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import BranchIcon from '../../assets/images/ic_branch.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import { OrderHeatMap } from '../../data/fakeDataMarketing';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TypeDiscountIcon from '../../assets/images/ic_type-dis.png';
import InputKit from '../../kits/input/InputKit';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';

const MarketingSetup = ({ active, setActive }) => {
  const [progress, setProgress] = useState(33.33);
  const [platform, setPlatform] = useState('');
  const [branch, setBranch] = useState('');
  const [typeDiscount, setTypeDiscount] = useState('');
  const [links, setLinks] = useState(false);
  const [menu, setMenu] = useState('');
  const [item, setItem] = useState('');
  const [minOrder, setMinOrder] = useState(0);
  const [maxOrder, setMaxOrder] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date()),
    endDate: new Date(),
  });

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
  const getProgress = () => {
    if (progress === 33.33) {
      return (
        <div className="left-part-middle">
          <TypographyKit variant="h4">1.Select platform and branches</TypographyKit>
          <TypographyKit sx={{ fontSize: '18px' }} color="#637381" variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
          </TypographyKit>
          <CompetitionDropdown
            rows={['talabat', 'deliveroo']}
            icon={PlatformIcon}
            title="Select a Platform"
            className="top-competition"
            setRow={setPlatform}
            select={platform}
          />
          <CompetitionDropdown
            rows={['1 Branch', '2 Branch']}
            icon={BranchIcon}
            title="Select Branches"
            className="top-competition"
            setRow={setBranch}
            select={branch}
          />
        </div>
      );
    }
    if (progress === 66.66) {
      return (
        <div className="left-part-middle">
          <TypographyKit variant="h4">2.Select the Type of the offer</TypographyKit>
          <TypographyKit sx={{ fontSize: '18px' }} color="#637381" variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
          </TypographyKit>
          <TextfieldKit
            onChange={(e) => setMenu(e.target.value)}
            className="marketing-textfield"
            label="Menu"
            variant="outlined"
          />
          <TextfieldKit
            onChange={(e) => setItem(e.target.value)}
            className="marketing-textfield"
            label="Item"
            variant="outlined"
          />
          <CompetitionDropdown
            rows={['1 type', '2 type']}
            icon={TypeDiscountIcon}
            title="Type of discount"
            className="top-competition type-dis"
            setRow={setTypeDiscount}
            select={typeDiscount}
          />
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
            <TypographyKit variant="div">
              <TypographyKit>Max Order</TypographyKit>
              <InputKit
                onChange={(e) => setMaxOrder(e.target.value)}
                type="number"
                placeholder="$0.00"
                className="min-max-textfield"
              />
            </TypographyKit>
          </TypographyKit>
        </div>
      );
    }
    return (
      <div className="left-part-middle">
        <TypographyKit variant="h4">3.Select the Duration</TypographyKit>
        <TypographyKit sx={{ fontSize: '18px' }} color="#637381" variant="subtitle">
          Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
        </TypographyKit>
        <TextfieldKit
          onChange={(e) => setMenu(e.target.value)}
          className="marketing-textfield"
          label="Menu"
          variant="outlined"
        />
        <TextfieldKit
          onChange={(e) => setItem(e.target.value)}
          className="marketing-textfield"
          label="Item"
          variant="outlined"
        />
        <CompetitionDropdown
          rows={['1 type', '2 type']}
          icon={TypeDiscountIcon}
          title="Type of discount"
          className="top-competition type-dis"
          setRow={setTypeDiscount}
          select={typeDiscount}
        />
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
          <TypographyKit variant="div">
            <TypographyKit>Max Order</TypographyKit>
            <InputKit
              onChange={(e) => setMaxOrder(e.target.value)}
              type="number"
              placeholder="$0.00"
              className="min-max-textfield"
            />
          </TypographyKit>
        </TypographyKit>
      </div>
    );
  };
  useEffect(() => {
    if (progress === 33.33) {
      setDisabled(!(platform && branch));
    }
    if (progress === 66.66) {
      setDisabled(!(menu && item && typeDiscount && minOrder && maxOrder));
    }
  }, [progress, platform, branch, menu, item, typeDiscount, minOrder, maxOrder]);
  return (
    <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
      <PaperKit className="marketing-paper">
        <ContainerKit>
          <div className="left-part">
            <div className="left-part-top">
              <div>
                <TypographyKit onClick={() => setProgress(66.66)} variant="h4">
                  Set up an offer
                </TypographyKit>

                <img
                  tabIndex={-1}
                  role="presentation"
                  onClick={() => setActive(false)}
                  src={CloseIcon}
                  alt="close icon"
                />
              </div>
              <BoxKit className="progress-bar" sx={{ display: 'flex', alignItems: 'center' }}>
                <BoxKit sx={{ width: '100%', mr: 1 }}>
                  <LinearProgressKit variant="determinate" value={progress} />
                </BoxKit>
                <BoxKit sx={{ minWidth: 35 }}>
                  <TypographyKit variant="body2" color="text.secondary">{`${Math.round(
                    progress / 33,
                  )} / 3`}</TypographyKit>
                </BoxKit>
              </BoxKit>
            </div>
            {getProgress()}
            <div className="left-part-bottom">
              <ButtonKit
                onClick={() => setProgress(progress - 33.33)}
                variant="outlined"
                disabled={!!(progress < 66.66)}>
                Previous Step
              </ButtonKit>
              <ButtonKit
                onClick={() => setProgress(progress + 33.33)}
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
                <TypographyKit variant="h5">
                  Max Revenue this week
                  <TypographyKit variant="span">${OrderHeatMap.max_value}</TypographyKit>
                </TypographyKit>
                <TypographyKit variant="h5">
                  Min Revenue this week
                  <TypographyKit variant="span">${OrderHeatMap.min_value}</TypographyKit>
                </TypographyKit>
              </TypographyKit>
              <TypographyKit variant="div" sx={{ display: 'flex' }}>
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
                            sx={{
                              background: `${
                                obj[indexObj + 5].color ? obj[indexObj + 5].color : '#919EAB1F'
                              }`,
                            }}
                            key={num}
                          />
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
