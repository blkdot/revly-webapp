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
import talabat from '../../assets/images/talabat.png';
import deliveroo from '../../assets/images/deliveroo.png';
import ArrowIcon from '../../assets/images/arrow.png';
import AudienceIcon from '../../assets/images/ic_audience.png';
import TimerIcon from '../../assets/images/ic_timer.png';
import menuIcon from '../../assets/images/ic_menu.png';
import ItemMenuIcon from '../../assets/images/ic_item-menu.png';
import selectIcon from '../../assets/images/ic_select.png';
import CalendarCheckGrayIcon from '../../assets/images/ic_calendar-check-gray.png';
import CalendarCloseGrayIcon from '../../assets/images/ic_calendar-close-gray.png';
import TimerCheckGrayIcon from '../../assets/images/ic_timer-check-gray.png';
import TimerCloseGrayIcon from '../../assets/images/ic_timer-close-gray.png';
import CreatedIcon from '../../assets/images/ic_created.png';

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

const MarketingSetup = ({ active, setActive, ads }) => {
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
  const [created, setCreated] = useState(false);

  const [launchOrder, setLaunchOrder] = useState([{ order: '', arrow: '', number: '', id: 1 }]);
  const [stopOffer, setStopOffer] = useState([{ order: '', arrow: '', number: '', id: 1 }]);

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
  const getTypeSchedule = () => {
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
      return everyWeek.toLowerCase().replace('every', '').split(' ').join('');
    }
    if (customDay === 'Customised Days') {
      return customisedDay.toString().toLowerCase().replace(/,/g, '.');
    }

    return 'now';
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

  const [steps, setSteps] = useState([0, 1, 2, 3, 4]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    setBranch('');
    setMenu('Offer on the whole Menu');
  }, [platform]);

  // TODO: Send request
  const handleSchedule = async () => {
    const clonedVendor = { ...branchData };
    delete clonedVendor.platform;

    const menuType =
      menu === 'Offer on the whole Menu'
        ? null
        : { menu_items: getMenuItem(), theme: getTypeItemMenu() };

    const dataReq = {
      start_date: format(startingDate, 'yyyy-MM-dd'),
      start_hour: getHourArr('startTime'),
      end_date: format(endingDate, 'yyyy-MM-dd'),
      end_hour: getHourArr('endTime'),
      type_schedule: getTypeSchedule(),
      menu_type: menuType,
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

    if (res instanceof Error) {
      triggerAlertWithMessageError(res.message);
      return;
    }

    setCreated(true);
    setRecap(false);
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

        if (!resRevenue.data || !resOrders.data) return;

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
    setSteps([0, 1, 2, 3, 4]);
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
    const newBranchData = vendorsList.find((v) => v.data.vendor_name === branch);

    setBranchData(newBranchData);
  }, [branch]);

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
      const arr = value.map((v) => category.filter((k) => k.category === v)).flat();
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
  }, [customDay, duration]);

  const renderGradientValue = (v, i) => {
    const indices = links === 'revenue' ? 'AED' : '';

    if (i === 0) {
      return (
        <>
          {indices}&nbsp;{0} - {indices}&nbsp;{v}
        </>
      );
    }

    return (
      <>
        {indices}&nbsp;{rangeColorIndices[links][i - 1]} - {indices}&nbsp;{v}
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
    setSelected(1);
    setCreated(false);
    body.style.overflowY = 'visible';
  };

  useEffect(() => {
    setSelected(1);
    setRecap(false);
  }, [active]);

  const [recap, setRecap] = useState(false);
  const getItemMenuNamePrice = () => {
    const arr = [];
    checked.forEach((c) => {
      category.forEach((obj) =>
        obj.name === c ? arr.push({ name: obj.name, price: obj.price }) : false,
      );
    });
    return arr;
  };
  const getRecap = () => {
    if (created) {
      return (
        <div style={{ height: '100%' }}>
          <div className="left-part-top">
            <div>
              <TypographyKit variant="h4"> </TypographyKit>

              <img
                tabIndex={-1}
                role="presentation"
                onClick={() => closeSetup()}
                src={CloseIcon}
                alt="close icon"
              />
            </div>
          </div>
          <div className="created-wrapper">
            <img src={CreatedIcon} alt="Created Icon" />
            <TypographyKit variant="h3">Let’s Go !!</TypographyKit>
            <p>The {ads ? 'Ads' : 'Offer'} has Been Created Successfuly</p>
          </div>
        </div>
      );
    }
    if (recap) {
      return (
        <div>
          <div className="left-part-top">
            <div>
              <TypographyKit variant="h4">{ads ? 'Ads' : 'Offer'} Recap </TypographyKit>

              <img
                tabIndex={-1}
                role="presentation"
                onClick={() => closeSetup()}
                src={CloseIcon}
                alt="close icon"
              />
            </div>
          </div>
          <BoxKit className="left-part-radio recap-left-part recap-left-part-inside">
            <div>
              <img width={35} height={35} src={selectIcon} alt="select" />
              <div>{branch}</div>
            </div>
            <div>
              <p>Platform:</p>
              <img src={platform === 'talabat' ? talabat : deliveroo} alt={platform} />
            </div>
          </BoxKit>
          <BoxKit className="left-part-radio recap-left-part">
            <div className="radio recap-box-wrapper">
              <div className="recap-box">
                <div>
                  <span>
                    <img style={{ filter: 'none' }} src={TimerIcon} alt="Timer Icon" />
                  </span>
                  <div>
                    <div>{duration}</div>
                    {duration === 'Program the offer duration' ? (
                      <img className="arrow-icon" src={ArrowIcon} alt="arrow" />
                    ) : (
                      ''
                    )}
                  </div>
                  {duration === 'Program the offer duration' ? (
                    <div className="customised-column">
                      <div>{customDay}</div>
                      <p>
                        {customDay === 'Customised Days' ? customisedDay.join(', ') : everyWeek}
                      </p>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className="radio recap-box-wrapper column">
              <div className="recap-between">
                <div>
                  <img src={CalendarCheckGrayIcon} alt="calendar check icon" />
                  <div>
                    <div>Starting Date</div>
                    <div>{format(startingDate, 'dd MMM yyyy')}</div>
                  </div>
                </div>
                <div className="right">
                  <img src={CalendarCloseGrayIcon} alt="calendar close icon" />
                  <div>
                    <div>Ending Date</div>
                    <div>{format(endingDate, 'dd MMM yyyy')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="radio recap-box-wrapper column">
              {times.map((obj, index) => (
                <div className="recap-between" key={obj.pos}>
                  <div>
                    <img src={TimerCheckGrayIcon} alt="timer check icon" />
                    <div>
                      <div>Start Time {index + 1}</div>
                      <div>{format(obj.startTime, 'HH:00 aaa')}</div>
                    </div>
                  </div>
                  <div className="right">
                    <img src={TimerCloseGrayIcon} alt="timer check icon" />
                    <div>
                      <div>End Time {index + 1}</div>
                      <div>{format(obj.endTime, 'HH:00 aaa')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BoxKit>
          {platform === 'deliveroo' ? (
            <BoxKit className="left-part-radio recap-left-part">
              <div className="radio recap-box-wrapper">
                <div className="recap-box">
                  <div>
                    <span>
                      <img style={{ filter: 'none' }} src={AudienceIcon} alt="Audience Icon" />
                    </span>
                    <div>
                      <div>Target Audience</div>
                      <img className="arrow-icon not-display" src={ArrowIcon} alt="arrow" />
                    </div>
                    <div style={{ marginLeft: 0 }}>
                      <div>{targetAudience}</div>
                    </div>
                  </div>
                </div>
              </div>
            </BoxKit>
          ) : (
            ''
          )}
          <BoxKit className="left-part-radio under-textfields recap-left-part radio-dates active">
            <div className="radio recap-box-wrapper">
              <div className="recap-box">
                <div>
                  <span>
                    <img
                      src={menu === 'Offer on An Item from the Menu' ? ItemMenuIcon : menuIcon}
                      alt={menu}
                    />
                  </span>
                  <div>
                    <div>{menu}</div>
                    {menu === 'Offer on An Item from the Menu' ? (
                      <img className="arrow-icon not-display" src={ArrowIcon} alt="arrow" />
                    ) : (
                      ''
                    )}
                  </div>
                  {menu === 'Offer on An Item from the Menu' ? (
                    <div style={{ marginLeft: 0 }}>
                      <div>{itemMenu}</div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div
              className={`radio recap-box-wrapper between under ${
                menu !== 'Offer on An Item from the Menu' ? 'border-none' : ''
              }`}
            >
              <div className="recap-between mov">
                <div>
                  <div>
                    <div>Procentage Discount</div>
                    <div>{discountPercentage}</div>
                  </div>
                </div>
                <div className="right">
                  <div>
                    <div>Minimum Order</div>
                    <div>{minOrder}</div>
                  </div>
                </div>
              </div>
              {menu === 'Offer on An Item from the Menu' ? (
                <div className="recap-between no-border">
                  {getItemMenuNamePrice().map((obj) => (
                    <div>
                      <div>{obj.name}</div>
                      <div>{obj.price} AED</div>
                    </div>
                  ))}
                </div>
              ) : (
                ''
              )}
            </div>
          </BoxKit>
        </div>
      );
    }
    return (
      <div>
        <div className="left-part-top">
          <div>
            <TypographyKit variant="h4">Set up an {ads ? 'Ads' : 'Offer'}</TypographyKit>

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
          setLaunchOrder={setLaunchOrder}
          launchOrder={launchOrder}
          setStopOffer={setStopOffer}
          stopOffer={stopOffer}
        />
      </div>
    );
  };
  const getRecapBtn = () => {
    if (recap) {
      return 'Lanch Offer';
    }
    if (steps.length - 1 === selected) {
      return 'Confirm';
    }
    return 'Next Step';
  };
  return (
    <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
      <PaperKit className="marketing-paper">
        <ContainerKit className="setup-container">
          <div className="left-part">
            {getRecap()}
            {created ? (
              <div className="left-part-bottom">
                <ButtonKit onClick={() => closeSetup()} variant="outlined">
                  CLose
                </ButtonKit>
              </div>
            ) : (
              <div className="left-part-bottom">
                <ButtonKit
                  onClick={() => (recap ? setRecap(false) : setSelected(selected - 1))}
                  variant="outlined"
                  disabled={!(selected >= 2)}
                >
                  Previous Step
                </ButtonKit>
                <ButtonKit
                  onClick={() => {
                    if (recap) {
                      handleSchedule();
                    }
                    if (steps.length - 1 === selected) {
                      setRecap(true);
                    } else {
                      setSelected(selected + 1);
                    }
                  }}
                  disabled={disabled}
                  variant="contained"
                >
                  {getRecapBtn()}
                </ButtonKit>
              </div>
            )}
          </div>
          <div className="right-part">
            <div className="right-part-header">
              <TypographyKit
                className={`right-part-header_link ${links === 'orders' ? 'active' : ''}`}
                variant="div"
              >
                <BoxKit
                  className={links === 'revenue' ? 'active' : ''}
                  onClick={() => setLinks('revenue')}
                >
                  <img src={RevenueHeatMapIcon} alt="Revenue Heat Map Icon" />
                  Revenue
                </BoxKit>
                <BoxKit
                  className={links === 'orders' ? 'active' : ''}
                  onClick={() => setLinks('orders')}
                >
                  <img src={PlatformIcon} alt="Order Heat Map Icon" />
                  Orders
                </BoxKit>
              </TypographyKit>
              <Dates
                isMarketingHeatMap
                beforePeriodBtn={beforePeriodBtn}
                setbeforePeriodBtn={setBeforePeriodBtn}
              />
            </div>
            <TypographyKit variant="div" className="right-part-main">
              <TypographyKit className="right-part-main-title" variant="div">
                <TypographyKit
                  variant="div"
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
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
                                sx={{ background: '#919EAB1F' }}
                              >
                                {renderHeatmapBox()}
                              </TypographyKit>
                            );

                          return (
                            <Tooltip
                              title={renderTooltipContent(obj[indexObj + 5].data)}
                              key={num}
                              arrow
                            >
                              <ItemHeatmap>
                                <TypographyKit
                                  className="heatmap-btn"
                                  sx={{ background: obj[indexObj + 5].color }}
                                >
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
