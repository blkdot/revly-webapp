import React, { useState, useEffect } from 'react';
import { startOfWeek } from 'date-fns';
import dayjs from 'dayjs';
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
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TypeDiscountIcon from '../../assets/images/ic_type-dis.png';
import InputKit from '../../kits/input/InputKit';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import useApi from '../../hooks/useApi';
import { useUserAuth } from '../../contexts/AuthContext';
import { useGlobal } from '../../hooks/useGlobal';

const defaultHeatmapState = {
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
};

const MarketingSetup = ({ active, setActive }) => {
  const [progress, setProgress] = useState(33.33);
  const [platform, setPlatform] = useState('');
  const [branch, setBranch] = useState('');
  const [typeDiscount, setTypeDiscount] = useState('');
  const [links, setLinks] = useState('revenue');
  const [menu, setMenu] = useState('');
  const [item, setItem] = useState('');
  const [minOrder, setMinOrder] = useState(0);
  const [maxOrder, setMaxOrder] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date()),
    endDate: new Date(),
  });
  const [heatmapData, setHeatmapData] = useState({
    revenue: defaultHeatmapState,
    orders: defaultHeatmapState,
  });
  const { getHeatmap } = useApi();
  const { user } = useUserAuth();
  const { vendorsContext, titleDate } = useGlobal();

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
      colors: ['#906BFF47', '#906BFF80', '#7952EEA6', '#7E5BE5'],
      vendors: vendorsContext,
    };

    Promise.all([getHeatmap('revenue', body), getHeatmap('orders', body)]).then(
      ([resRevenue, resOrders]) => {
        const initialisationStateRevenue = resRevenue.heatmap
          ? resRevenue.heatmap.all
          : defaultHeatmapState;
        const initialisationStateOrders = resOrders.heatmap
          ? resOrders.heatmap.all
          : defaultHeatmapState;

        setHeatmapData({ revenue: initialisationStateRevenue, orders: initialisationStateOrders });
      },
    );
  };

  useEffect(() => {
    getHeatmapData();
  }, [JSON.stringify(beforePeriodBtn)]);

  useEffect(() => {
    if (progress === 33.33) {
      setDisabled(!(platform && branch));
    }
    if (progress === 66.66) {
      setDisabled(!(menu && item && typeDiscount && minOrder && maxOrder));
    }
  }, [progress, platform, branch, menu, item, typeDiscount, minOrder, maxOrder]);

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
              <div>
                <TypographyKit className="right-part-main-title" variant="div">
                  <TypographyKit variant="span" style={{ fontWeight: 'bold' }}>
                    Min Revenue this {titleDate}
                  </TypographyKit>
                  <TypographyKit variant="span" style={{ fontWeight: 'bold' }}>
                    Max Revenue this {titleDate}
                  </TypographyKit>
                </TypographyKit>
                <div className="marketing-case">
                  <div
                    className="marketing-case__item"
                    style={{ background: '#F6F3FF', marginRight: '0.5rem' }}>{`<1`}</div>
                  <div
                    className="marketing-case__item"
                    style={{ background: '#EDE7FF', marginRight: '0.5rem' }}>{`<30`}</div>
                  <div
                    className="marketing-case__item"
                    style={{ background: '#CAB8FF', marginRight: '0.5rem' }}>{`<50`}</div>
                  <div className="marketing-case__item" style={{ background: '#906BFF' }}>
                    $5,213,98
                  </div>
                </div>
              </div>
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
                    {heatMapFormatter(links).map((obj, index) => (
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
