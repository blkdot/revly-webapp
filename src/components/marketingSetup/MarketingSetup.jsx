import { addDays, addHours, format, startOfWeek } from 'date-fns';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { Tooltip } from '@mui/material';
import CloseIcon from '../../assets/images/ic_close.png';
import Dates from '../dates/Dates';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './MarketingSetup.scss';
import PaperKit from '../../kits/paper/PaperKit';
import ContainerKit from '../../kits/container/ContainerKit';
import BoxKit from '../../kits/box/BoxKit';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import { useGlobal } from '../../hooks/useGlobal';
import { usePlatform } from '../../hooks/usePlatform';
import { useUserAuth } from '../../contexts/AuthContext';
import useVendors from '../../hooks/useVendors';
import useApi from '../../hooks/useApi';
import { useAlert } from '../../hooks/useAlert';
import MarketingSetupStepper from '../marketingSetupStepper/MarketingSetupStepper';
import GetProgress from './MarketingGetProgress';

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
  const [links, setLinks] = useState('revenue');
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
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
  const { getHeatmap, triggerOffers } = useApi();
  const { user } = useUserAuth();
  const { vendorsContext } = useGlobal();
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date(addDays(new Date(startingDate), 1)));
  const [customDay, setCustomDay] = useState('');
  const [disabledDate, setDisabledDate] = useState(true);
  const [customisedDay, setCustomisedDay] = useState([]);
  const [times, setTimes] = useState([
    {
      startTime: new Date(null, null, null, format(addHours(new Date(), 1), 'HH'), 0),
      endTime: new Date(null, null, null, format(addHours(new Date(), 2), 'HH'), 0),
      pos: 1,
    },
  ]);
  const [everyWeek, setEveryWeek] = useState('');
  const [itemMenu, setItemMenu] = useState('Flash Deal');
  const [category, setCategory] = useState([]);
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [targetAudience, setTargetAudience] = useState('All customers');

  const [checked, setChecked] = useState([]);
  const getDiscountOrMov = (type) => {
    if (type === 'discount') {
      if (itemMenu === 'Flash Deal') {
        return ['50%'];
      }
      if (itemMenu === 'Order more , save more') {
        return ['30%', '50%'];
      }
      if (itemMenu === 'Restaurent Pick') {
        return ['20%', '25%', '30%', '35%', '40%', '45%', '50%'];
      }
      return ['100%'];
    }
    if (type === 'mov') {
      if (itemMenu === 'Flash Deal') {
        return ['0 AED', '10 AED'];
      }
      if (itemMenu === 'Order more , save more') {
        return ['60 AED'];
      }
      if (itemMenu === 'Restaurent Pick') {
        return ['0 AED', '15 AED', '30 AED'];
      }
      return ['15 AED', '30 AED', '60 AED'];
    }
    return [];
  };
  const [categoryDataList, setCategoryDataList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { triggerAlertWithMessageError } = useAlert('error');
  const { getMenu } = useApi();
  const { vendors: vendorsList } = useVendors();
  const [branchData, setBranchData] = useState('');

  const getHourArr = (hour) => {
    const arr = [];
    times.forEach((obj) =>
      Object.keys(obj).forEach((keys) => {
        if (keys === hour) {
          if (
            isValidDate(obj[hour]) &&
            obj[hour] !== null &&
            !Number.isNaN(new Date(obj[hour]).getTime())
          ) {
            arr.push(format(obj[keys], 'HH:00'));
          }
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
    return 'once';
  };
  const getTargetAudience = () => {
    if (targetAudience === 'New customer') {
      return 'new_customers';
    }
    if (targetAudience === 'Deliveroo plus') {
      return 'subscribers';
    }
    return 'orders';
  };
  const getMenuItem = () => {
    const arr = [];
    category.forEach((obj) => {
      checked.forEach((c) => {
        if (obj.name === c) {
          arr.push({ id: obj.id, drn_id: obj.drn_id });
        }
      });
    });
    return arr;
  };
  const getTypeItemMenu = () => {
    if (itemMenu === 'Flash Deal') {
      return 'flash-deals';
    }
    if (itemMenu === 'Order more , save more') {
      return 'groups';
    }
    if (itemMenu === 'Restaurent Pick') {
      return 'restaurant-picks';
    }
    return 'free-items';
  };

  const [steps, setSteps] = useState([0, 1, 2, 3]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // TODO: Send request
  const handleSchedule = async () => {
    const clonedVendor = { ...branchData };
    delete clonedVendor.platform;

    const dataReq = {
      start_date: format(startingDate, 'yyyy-MM-dd'),
      start_hour: getHourArr('startTime'),
      end_date: format(endingDate, 'yyyy-MM-dd'),
      end_hour: getHourArr('endTime'),
      type_offer: getTypeOffer(),
      menu_type: { menu_items: getMenuItem(), theme: getTypeItemMenu() },
      goal: getTargetAudience(),
      discount: Number(discountPercentage.replace('%', '')),
      mov: Number(minOrder.toLowerCase().replace('aed', '')),
      master_email: user.email,
      access_token: user.accessToken,
      platform_token:
        userPlatformData.platforms[platform].access_token ??
        userPlatformData.platforms[platform].access_token_bis,
      vendors: [clonedVendor],
      chain_id: clonedVendor.chain_id,
    };

    const res = await triggerOffers(platform, dataReq);

    console.log(res);
  };

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
        if (resRevenue instanceof Error || resOrders instanceof Error) return;

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
    if (!vendorsContext) return;

    getHeatmapData();
  }, [JSON.stringify(beforePeriodBtn), JSON.stringify(vendorsContext)]);

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
  useEffect(() => {
    setDiscountPercentage('');
    setMinOrder('');
  }, [itemMenu, menu]);

  const getMenuData = async (vendor, platforms) => {
    try {
      const res = await getMenu(
        { master_email: user.email, access_token: user.accessToken, vendor },
        platforms,
      );

      if (!res.data) {
        throw new Error('');
      }

      const resp = Object.keys(res.data.menu_items)
        .map((v) => res.data.menu_items[v])
        .map((k) => Object.keys(k).map((el) => k[el]))
        .flat();

      setCategoryDataList(res.data.categories);
      setCategory(resp);
    } catch (err) {
      setCategory([]);
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };

  useEffect(() => {
    if (!branchData && vendorsList.length) {
      setBranchData(vendorsList[0]);
    }

    if (branchData) {
      getMenuData(branchData, platform);
    }
  }, [vendorsList, branchData, platform]);

  const handleCategoryDataChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      const arr = value.map((v) => category.filter((k) => k.categoryData === v)).flat();
      setFilteredCategoryData(arr);
    } else {
      setFilteredCategoryData([]);
    }
    setCategoryData(value);
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
        if (menu === 'Offer on An Item from the Menu') {
          setSteps([0, 1, 2, 3, 4, 5]);
          setDisabled(!(menu && discountPercentage && minOrder && itemMenu));
        } else {
          setSteps([0, 1, 2, 3, 4]);
          setDisabled(!(menu && discountPercentage && minOrder));
        }
      }
      if (menu === 'Offer on An Item from the Menu') {
        if (selected === 3) {
          setDisabled(checked.length === 0);
        }
        if (selected === 4) {
          if (duration === 'Program the offer duration') {
            setSteps([0, 1, 2, 3, 4, 5, 6]);
            setDisabled(!customDay);
          } else {
            setSteps([0, 1, 2, 3, 4, 5]);
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
          if (selected === 5) {
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
      }
      if (menu === 'Offer on the whole Menu') {
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
    checked,
  ]);
  useEffect(() => {
    setTimes([
      {
        startTime: new Date(null, null, null, format(new Date(addHours(new Date(), 1)), 'HH'), 0),
        endTime: new Date(null, null, null, format(new Date(addHours(new Date(), 2)), 'HH'), 0),
        pos: 1,
      },
    ]);
  }, [customDay]);

  const renderGradientValue = (v, i) => {
    if (i === 0) {
      return (
        <>
          AED&nbsp;{rangeColorIndices[links][i]} - AED&nbsp;{v}
        </>
      );
    }

    return (
      <>
        AED&nbsp;{rangeColorIndices[links][i - 1]} - AED&nbsp;{v}
      </>
    );
  };

  const renderTooltipContent = (data) => (
    <div className="heatmap-tooltip">
      <div className="heatmap-tooltip__item">
        <span className="__item-text">total daily {links} till slot</span>
        <span className="__item-value">
          {data.x_accrued_intra_day}&nbsp;{links === 'revenue' ? 'AED' : ''}
        </span>
      </div>
      <div className="heatmap-tooltip__item">
        <span className="__item-text">Weekly total {links} of slot</span>
        <span className="__item-value">
          {data.x_slot_across_week}&nbsp;{links === 'revenue' ? 'AED' : ''}
        </span>
      </div>
      <div className="heatmap-tooltip__item">
        <span className="__item-text">% of daily {links} </span>
        <span className="__item-value">
          {(data.x_percentage_intra_day * 100).toFixed(2)}&nbsp;%
        </span>
      </div>
    </div>
  );
  const closeSetup = () => {
    const body = document.querySelector('body');
    setActive(false);
    body.style.overflowY = 'visible';
  };
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
                    onClick={() => closeSetup()}
                    src={CloseIcon}
                    alt="close icon"
                  />
                </div>
                <MarketingSetupStepper selected={selected} steps={steps} />
              </div>
              <GetProgress
                selected={selected}
                getPlatform={getPlatform}
                platform={platform}
                handleCategoryDataChange={handleCategoryDataChange}
                userPlatformData={userPlatformData}
                vendorsContext={vendorsContext}
                setBranch={setBranch}
                branch={branch}
                menu={menu}
                setMenu={setMenu}
                setDiscountPercentage={setDiscountPercentage}
                discountPercentage={discountPercentage}
                setMinOrder={setMinOrder}
                minOrder={minOrder}
                itemMenu={itemMenu}
                setItemMenu={setItemMenu}
                getDiscountOrMov={getDiscountOrMov}
                categoryData={categoryData}
                categoryDataList={categoryDataList}
                filteredCategoryData={filteredCategoryData}
                category={category}
                setChecked={setChecked}
                checked={checked}
                duration={duration}
                setDuration={setDuration}
                endingDate={endingDate}
                onChange={onChange}
                setEndingDate={setEndingDate}
                times={times}
                setTimes={setTimes}
                customDay={customDay}
                setCustomDay={setCustomDay}
                targetAudience={targetAudience}
                setTargetAudience={setTargetAudience}
                setSteps={setSteps}
                setSelected={setSelected}
                setEveryWeek={setEveryWeek}
                everyWeek={everyWeek}
                days={days}
                setCustomisedDay={setCustomisedDay}
                customisedDay={customisedDay}
                disableWeekends={disableWeekends}
                startingDate={startingDate}
                setStartingDate={setStartingDate}
              />
            </div>
            <div className="left-part-bottom">
              <ButtonKit
                onClick={() => setSelected(selected - 1)}
                variant="outlined"
                disabled={!(selected >= 2)}>
                Previous Step
              </ButtonKit>
              {/* TODO: create Schedule Offer Button here on last step for each platform */}
              {selected === steps.length - 1 ? (
                <ButtonKit onClick={handleSchedule} disabled={disabled} variant="contained">
                  Next Step
                </ButtonKit>
              ) : (
                <ButtonKit
                  onClick={() => setSelected(selected + 1)}
                  disabled={disabled}
                  variant="contained">
                  Next Step
                </ButtonKit>
              )}
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
                  <TypographyKit variant="h6" style={{ fontSize: '15px' }}>
                    Min {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('MM-DD')}
                  </TypographyKit>
                  <TypographyKit variant="h6" style={{ fontSize: '15px' }}>
                    Max {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('MM-DD')}
                  </TypographyKit>
                </TypographyKit>
                <TypographyKit variant="div" className="color-btns">
                  {rangeColorIndices[links]?.map((r, i) => (
                    <TypographyKit key={nanoid()}>{renderGradientValue(r, i)}</TypographyKit>
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
                      <TypographyKit key={day}>{day.slice(0, 3)}</TypographyKit>
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
