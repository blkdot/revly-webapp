import React, { useState, useEffect } from 'react';
import { addDays, addHours, format, startOfWeek, subWeeks, endOfWeek, addMinutes } from 'date-fns';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { Tooltip } from '@mui/material';
import _ from 'lodash';

import Dates from '../dates/Dates';
import ButtonKit from '../../kits/button/ButtonKit';
import './MarketingSetup.scss';
import PaperKit from '../../kits/paper/PaperKit';
import ContainerKit from '../../kits/container/ContainerKit';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import useVendors from '../../hooks/useVendors';
import { usePlatform } from '../../hooks/usePlatform';
import { useUserAuth } from '../../contexts/AuthContext';
import useApi from '../../hooks/useApi';
import { useAlert } from '../../hooks/useAlert';
import TypographyKit from '../../kits/typography/TypographyKit';
import BoxKit from '../../kits/box/BoxKit';
import heatmapSelected, { getFormatedEndDate } from '../../utlls/heatmap/heatmapSelected';
import { rangeHoursOpenedDay, minHour, maxHour } from '../../utlls/heatmap/heatmapSelectedData';
import { OfferCrossPlatforms } from '../../api/marketingApi';
import GetRecap from './GetRecap';

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
  const { userPlatformData } = usePlatform();
  const [platform, setPlatform] = useState([
    userPlatformData.platforms.deliveroo.active ? 'deliveroo' : 'talabat',
  ]);
  const [platformData, setPlatformData] = useState(
    userPlatformData.platforms.deliveroo.active ? 'deliveroo' : 'talabat',
  );
  const [selected, setSelected] = useState(1);
  const [links, setLinks] = useState('revenue');
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [beforePeriodBtn, setBeforePeriodBtn] = useState({
    startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
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
  const { vendors } = useVendors();
  const [categoryDataList, setCategoryDataList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { triggerAlertWithMessageError } = useAlert('error');
  const { getMenu } = useApi();
  const { vendorsObj, vendorsArr } = vendors;
  const [branch, setBranch] = useState(JSON.parse(JSON.stringify(vendors)));
  const [branchData, setBranchData] = useState(
    vendorsObj?.[platformData]?.[0]?.data?.vendor_name || '',
  );
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date(addDays(new Date(startingDate), 1)));
  const [customDay, setCustomDay] = useState('');
  const [disabledDate, setDisabledDate] = useState(true);
  const [customisedDay, setCustomisedDay] = useState([]);
  const [times, setTimes] = useState([
    {
      startTime: new Date(
        null,
        null,
        null,
        format(new Date(), 'HH'),
        format(new Date(addMinutes(new Date(), 2)), 'mm'),
      ),
      endTime: new Date(null, null, null, format(addHours(new Date(), 1), 'HH'), 0),
      pos: 1,
    },
  ]);
  const [everyWeek, setEveryWeek] = useState('');
  const [itemMenu, setItemMenu] = useState('');
  const [category, setCategory] = useState([]);
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [targetAudience, setTargetAudience] = useState('All customers');
  const [created, setCreated] = useState(false);

  const [launchOrder, setLaunchOrder] = useState([
    { order: '# of orders', arrow: '<', number: '', id: 1, reletion: 'And' },
  ]);
  const [stopOrder, setStopOrder] = useState([
    { order: '# of orders', arrow: '>', number: '', id: 1, reletion: 'And' },
  ]);

  const [smRule, setSmRule] = useState(false);
  const [steps, setSteps] = useState([0, 1, 2, 3, 4]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
      if (itemMenu === 'Free Item') {
        return ['100%'];
      }
      return ['10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%'];
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
      if (itemMenu === 'Free Item') {
        return ['15 AED', '30 AED', '60 AED'];
      }
      return ['0 AED', '10 AED', '20 AED', '30 AED'];
    }
    return [];
  };

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

  useEffect(() => {
    if (duration === 'Starting Now') {
      setStartingDate(new Date());
      setCustomDay('now');
    }

    if (customDay !== 'customised Days') {
      setCustomisedDay([]);
    }
  }, [duration, customDay]);

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

  useEffect(() => {
    const newChainObj = JSON.parse(JSON.stringify(vendors.chainObj));
    const chainObjTemp = JSON.parse(JSON.stringify(vendors.chainObj));
    const newVendorsObj = { talabat: [], deliveroo: [] };
    const newVendorsArr = [];
    const newRestaurants = [];
    if (Object.keys(vendors.chainObj).length > 0) {
      Object.keys(newChainObj).forEach((chainName, index) => {
        if (index !== 0) {
          Object.keys(newChainObj[chainName]).forEach((vendorName) => {
            delete newChainObj[chainName][vendorName];
          });
        }
      });
      Object.keys(newChainObj).forEach((cName) => {
        Object.keys(newChainObj[cName]).forEach((vName) => {
          platform.forEach((p) => {
            newVendorsObj[p]?.push(newChainObj[cName][vName][p]);
          });
        });
      });
      Object.keys(chainObjTemp).forEach((cName) => {
        Object.keys(chainObjTemp[cName]).forEach((vName) => {
          platform.forEach((p) => {
            newVendorsArr?.push({ ...chainObjTemp[cName][vName][p], platform: p });
            newRestaurants?.push(chainObjTemp[cName][vName][p].data.vendor_name);
          });
        });
      });
    }
    setBranch({
      ...vendors,
      restaurants: newRestaurants,
      vendorsArr: newVendorsArr,
      vendorsObj: newVendorsObj,
      chainObj: newChainObj,
    });
    setMenu('Offer on the whole Menu');
  }, [platform, vendors]);
  const getPlatformToken = () => {
    if (Object.keys(vendors.display).length > 0) {
      return (
        userPlatformData.platforms[platform[0]].access_token ??
        userPlatformData.platforms[platform[0]].access_token_bis
      );
    }
    console.log(userPlatformData.platforms[platformData].access_token);
    return (
      userPlatformData.platforms[platformData].access_token ??
      userPlatformData.platforms[platformData].access_token_bis
    );
  };
  const handleSchedule = async () => {
    const newBranchData =
      Object.keys(vendors.display).length > 0
        ? branch.vendorsObj[platform[0]][0]
        : vendorsArr.find((v) => v.data.vendor_name === branchData);
    const clonedVendor = JSON.parse(JSON.stringify(newBranchData || {}));
    delete clonedVendor.platform;
    const menuType =
      menu === 'Offer on the whole Menu'
        ? null
        : { menu_items: getMenuItem(), theme: getTypeItemMenu() };

    const dataReq = {
      start_date: format(startingDate, 'yyyy-MM-dd'),
      start_hour: getHourArr('startTime'),
      end_date: getFormatedEndDate(endingDate, 'yyyy-MM-dd', times),
      end_hour: getHourArr('endTime'),
      type_schedule: getTypeSchedule(),
      menu_type: menuType,
      goal: getTargetAudience(),
      discount: Number(discountPercentage.replace('%', '')),
      mov: Number(minOrder.toLowerCase().replace('aed', '')),
      master_email: user.email,
      access_token: user.accessToken,
      platform_token: getPlatformToken(),
      vendors: [clonedVendor],
      chain_id: clonedVendor.chain_id,
    };

    const dataReqOfferCross = {
      start_date: format(startingDate, 'yyyy-MM-dd'),
      start_hour: getHourArr('startTime'),
      end_date: getFormatedEndDate(endingDate, 'yyyy-MM-dd', times),
      end_hour: getHourArr('endTime'),
      type_schedule: getTypeSchedule(),
      menu_type: menuType,
      goal: getTargetAudience(),
      discount: Number(discountPercentage.replace('%', '')),
      mov: Number(minOrder.toLowerCase().replace('aed', '')),
      master_email: user.email,
      access_token: user.accessToken,
      platform_token:
        userPlatformData.platforms[platform[0]].access_token ??
        userPlatformData.platforms[platform[0]].access_token_bis,
      vendors: branch.vendorsObj,
    };

    if (platform.length < 2) {
      const res = await triggerOffers(platform[0], dataReq);
      if (res instanceof Error) {
        triggerAlertWithMessageError(res.message);
        return;
      }
    } else {
      const res = await OfferCrossPlatforms(dataReqOfferCross);
      if (res instanceof Error) {
        triggerAlertWithMessageError(res.message);
        return;
      }
    }

    setCreated(true);
    setRecap(false);
  };
  const getHeatmapData = () => {
    delete vendorsObj.display;

    const body = {
      master_email: user.email,
      access_token: user.accessToken,
      start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
      colors: ['#EDE7FF', '#CAB8FF', '#906BFF', '#7E5BE5'],
      vendors: vendorsObj,
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
    if (!vendorsObj) return;

    getHeatmapData();
  }, [JSON.stringify(beforePeriodBtn), JSON.stringify(vendorsObj)]);

  const getPlatform = (e) => {
    const { value } = e.target;
    if (e.target.checked) {
      setPlatform([...platform, value]);
      return;
    }
    if (platform.length > 1) {
      platform.splice(
        platform.findIndex((el) => el === value),
        1,
      );
    }
    setPlatform([...platform]);
  };
  const getPlatformData = (e) => {
    const { value } = e.target;
    setPlatformData(value);
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
    const vendor = vendors.vendorsArr.find((v) => v.data.vendor_name === branchData);
    if (Object.keys(vendors.display).length === 0) {
      if (branchData && vendor) {
        getMenuData(vendor, platformData);
      }
    } else if (platform.length < 2 && branch && platform[0] !== 'talabat' && selected === 2) {
      const vendorDisplay = vendors.vendorsObj[platform[0]][0];
      getMenuData(vendorDisplay, platform[0]);
    }
  }, [platformData, branchData, platform, selected]);

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

  const timeSelected = () => {
    const typeObject = {
      once: 'mono',
      now: 'mono',
    };

    const response = heatmapSelected(
      typeObject[getTypeSchedule()] ?? 'multi',
      { startDate: startingDate, endDate: endingDate },
      times,
      heatmapData[links],
      getTypeSchedule() === 'workweek',
      customDay === 'Customised Days',
      customisedDay,
      customDay === 'Same day every week',
      everyWeek,
    );

    setHeatmapData({ ...heatmapData, [links]: response });
  };

  const clearTimeSelected = () => {
    const clonedheatmapData = { ...heatmapData };

    Object.values(clonedheatmapData[links]).forEach((objHeat, indexObjHeat) => {
      if (objHeat) {
        Object.keys(objHeat).forEach((num) => {
          if (objHeat[num].active) {
            delete clonedheatmapData[links][Object.keys(clonedheatmapData[links])[indexObjHeat]][
              num
            ].active;
          }
        });
      }
    });

    setHeatmapData({ ...heatmapData, [links]: { ...clonedheatmapData[links] } });
  };
  useEffect(() => {
    if (selected === 1) {
      if (Object.keys(vendors.display).length > 0) {
        setDisabled(!(branch && platform.length));
        clearTimeSelected();
      } else {
        setDisabled(!branchData);
        clearTimeSelected();
      }
    }
    if (selected === 2) {
      clearTimeSelected();
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
        clearTimeSelected();
      }
      if (selected === 4) {
        clearTimeSelected();
        timeSelected();
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
          timeSelected();
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
        timeSelected();
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
          timeSelected();
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
    vendors,
    branchData,
  ]);
  useEffect(() => {
    if (duration === 'Starting Now') {
      setTimes([
        {
          startTime: new Date(
            null,
            null,
            null,
            format(new Date(), 'HH'),
            format(new Date(addMinutes(new Date(), 2)), 'mm'),
          ),
          endTime: new Date(null, null, null, format(new Date(addHours(new Date(), 1)), 'HH'), 0),
          pos: 1,
        },
      ]);
    } else {
      setTimes([
        {
          startTime: new Date(null, null, null, format(new Date(), 'HH'), 0),
          endTime: new Date(null, null, null, format(new Date(addHours(new Date(), 1)), 'HH'), 0),
          pos: 1,
        },
      ]);
    }
  }, [duration, customDay]);

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
  // eslint-disable-next-line
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

  useEffect(() => {
    setItemMenu('');
  }, [menu]);

  useEffect(() => {
    clearTimeSelected();
    if (selected >= 3) {
      timeSelected();
    }
  }, [times, startingDate, endingDate, selected, customDay]);

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
  const progressData = {
    selected,
    getPlatform,
    platform,
    handleCategoryDataChange,
    userPlatformData,
    vendorsObj,
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
    setSteps,
    setSelected,
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
  };
  const recapData = {
    progressData,
    smRule,
    launchOrder,
    setLaunchOrder,
    setStopOrder,
    stopOrder,
    created,
    closeSetup,
    ads,
    minOrder,
    discountPercentage,
    menu,
    itemMenu,
    recap,
    steps,
    selected,
    getItemMenuNamePrice,
    branch,
    platform,
    duration,
    customDay,
    customisedDay,
    everyWeek,
    startingDate,
    endingDate,
    times,
    targetAudience,
    branchData,
    platformData,
    vendors,
  };
  const getRecapBtn = () => {
    if (recap) {
      return 'Launch Offer';
    }
    if (steps.length - 1 === selected) {
      return 'Confirm';
    }
    return 'Next Step';
  };

  const handleBack = () => {
    if (recap) {
      setRecap(false);
    } else if (smRule) {
      setSmRule(false);
    } else {
      setSelected(selected - 1);
    }
  };

  const getStyleHashureActive = (el) => {
    if (!el.color) return { background: '#919EAB1F' };

    if (!el.active) return { background: el.color };

    return {
      background: `linear-gradient(45deg, #2D99FF 1%, ${el.color} 1%, ${el.color} 49%, #2D99FF 49%, #2D99FF 51%, ${el.color} 51%, ${el.color} 99%, #2D99FF 99%)`,
      backgroundSize: '6px 6px',
      backgroundPosition: '50px 50px',
    };
  };

  return (
    <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
      <PaperKit id="marketing-setup" className="marketing-paper">
        <ContainerKit className="setup-container">
          <div className="left-part">
            <GetRecap recapData={recapData} />
            {created ? (
              <div className="left-part-bottom">
                <ButtonKit onClick={() => closeSetup()} variant="outlined">
                  CLose
                </ButtonKit>
              </div>
            ) : (
              <div className="left-part-bottom">
                <ButtonKit onClick={() => handleBack()} variant="outlined" disabled={selected < 2}>
                  Previous Step
                </ButtonKit>
                <ButtonKit
                  onClick={() => {
                    if (smRule) {
                      setSmRule(false);
                      setRecap(true);
                    }
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
                className={`right-part-header_link setup ${links === 'orders' ? 'active' : ''}`}
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
                defaultTypeDate="week"
                defaultTitle="last week"
                beforePeriodBtn={beforePeriodBtn}
                setbeforePeriodBtn={setBeforePeriodBtn}
                setupOffer
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
                  {_.range(minHour, maxHour + 1).map((num) => (
                    <TypographyKit key={num}>{rangeHoursOpenedDay[num].label ?? num}</TypographyKit>
                  ))}
                </TypographyKit>
                <TypographyKit sx={{ width: '100%' }} variant="div">
                  <TypographyKit variant="div" className="right-part-main-day">
                    {days.map((day) => (
                      <TypographyKit key={day}>{day.slice(0, 3)}</TypographyKit>
                    ))}
                  </TypographyKit>
                  <TypographyKit className="right-part-main-heatmap" variant="div">
                    {days.map((day) => (
                      <TypographyKit key={day} variant="div">
                        {_.range(minHour, maxHour + 1).map((n) => (
                          <TypographyKit
                            className={`heatmap-btn `}
                            key={n}
                            sx={{ background: '#919EAB1F' }}
                          >
                            <span />
                          </TypographyKit>
                        ))}
                      </TypographyKit>
                    ))}
                    <div className="heatmap-btn_wrapper">
                      {days.map((obj, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <TypographyKit key={`${obj}_${index}`} variant="div">
                          {_.range(minHour, maxHour + 1).map((num) => {
                            if (
                              !heatmapData[links][obj] ||
                              !heatmapData[links][obj][num] ||
                              !heatmapData[links][obj][num].color
                            ) {
                              return (
                                <TypographyKit
                                  style={{ '--i': num - 5 }}
                                  className={`absolute ${
                                    heatmapData[links][obj] &&
                                    heatmapData[links][obj][num] &&
                                    heatmapData[links][obj][num]?.active
                                      ? 'active'
                                      : ''
                                  }`}
                                  key={num}
                                >
                                  <span />
                                </TypographyKit>
                              );
                            }
                            return (
                              <Tooltip
                                className="absolute"
                                style={{ '--i': num - 5 }}
                                title={renderTooltipContent(heatmapData[links][obj][num].data)}
                                key={num}
                                arrow
                              >
                                <ItemHeatmap>
                                  <TypographyKit
                                    className="heatmap-btn "
                                    sx={getStyleHashureActive(heatmapData[links][obj][num])}
                                  >
                                    <span />
                                  </TypographyKit>
                                </ItemHeatmap>
                              </Tooltip>
                            );
                          })}
                        </TypographyKit>
                      ))}
                    </div>
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
// eslint-disable-next-line
const ItemHeatmap = React.forwardRef((props, ref) => <div {...props} ref={ref} />);

export default MarketingSetup;
