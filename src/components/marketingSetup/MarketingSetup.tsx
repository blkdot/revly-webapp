import { Tooltip } from '@mui/material';
import { useUserAuth } from 'contexts';
import { addDays, addHours, addMinutes, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import dayjs from 'dayjs';
import { useAlert, useApi, usePlatform } from 'hooks';
import { useAtom } from 'jotai';
import {
  BoxKit,
  ButtonKit,
  ContainerKit,
  PaperKit,
  SkeletonKit,
  SpinnerKit,
  TypographyKit,
} from 'kits';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import { vendorsAtom } from '../../store/vendorsAtom';
import heatmapSelected, { getFormatedEndDate } from '../../utlls/heatmap/heatmapSelected';
import { maxHour, minHour, rangeHoursOpenedDay } from '../../utlls/heatmap/heatmapSelectedData';
import Dates from '../dates/Dates';
import GetRecap from './GetRecap';
import './MarketingSetup.scss';

const defaultHeatmapState = {
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
};

const defaultRangeColorIndices = [0, 0, 0, 0];

const ItemHeatmap = React.forwardRef((props: any, ref: any) => <div {...props} ref={ref} />);

const MarketingSetup = ({ active, setActive, ads }: any) => {
  const { userPlatformData } = usePlatform();
  const getActivePlatform = () => {
    let activePlatform = '';
    Object.keys(userPlatformData.platforms).forEach((pl) => {
      if (userPlatformData.platforms[pl].length > 0) {
        if (userPlatformData.platforms[pl].find((obj) => obj.active)) {
          activePlatform = pl;
        }
      }
    });
    return activePlatform;
  };
  const [platform, setPlatform] = useState([getActivePlatform()]);
  const [selected, setSelected] = useState(1);
  const [links, setLinks] = useState('revenue');
  const [menu, setMenu] = useState('Offer on the whole Menu');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [duration, setDuration] = useState('Starting Now');
  const [disabled, setDisabled] = useState(false);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
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
  const [vendors] = useAtom(vendorsAtom);
  const [categoryDataList, setCategoryDataList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { triggerAlertWithMessageError } = useAlert();
  const { getMenu } = useApi();
  const { vendorsObj } = vendors as any;
  const [branch, setBranch] = useState(JSON.parse(JSON.stringify(vendors)));
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date(addDays(new Date(startingDate), 1)));
  const [typeSchedule, setTypeSchedule] = useState('Continues Offer');
  const [disabledDate, setDisabledDate] = useState(true);
  const [customisedDay, setCustomisedDay] = useState([]);
  const [times, setTimes] = useState([
    {
      startTime: new Date(
        null,
        null,
        null,
        Number(format(new Date(), 'HH')),
        Number(format(new Date(addMinutes(new Date(), 2)), 'mm')),
        null,
        null
      ),
      endTime: new Date(null, null, null, Number(format(addHours(new Date(), 1), 'HH')), 0),
      pos: 1,
    },
  ]);
  const [everyWeek, setEveryWeek] = useState('');
  const [itemMenu, setItemMenu] = useState('');
  const [category, setCategory] = useState([]);
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [targetAudience, setTargetAudience] = useState('All customers');
  const [created, setCreated] = useState(false);
  const [recap, setRecap] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);

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
  const [categoryLoading, setCategoryLoading] = useState(true);
  const itemMenuObj = {
    'Flash Deal': {
      discount: ['50%'],
      mov: ['0 AED', '10 AED'],
      type: 'flash-deals',
    },
    'Order more , save more': {
      discount: ['30%', '50%'],
      mov: ['60 AED'],
      type: 'groups',
    },
    'Restaurant Pick': {
      discount: ['20%', '25%', '30%', '35%', '40%', '45%', '50%'],
      mov: ['0 AED', '15 AED', '30 AED'],
      type: 'restaurant-picks',
    },
    'Free Items': {
      discount: ['100%'],
      mov: ['15 AED', '30 AED', '60 AED'],
      type: 'free-items',
    },
  };
  const getDiscountMovType = (type) => itemMenuObj[itemMenu][type];

  function isValidDate(d) {
    return d instanceof Date && !Number.isNaN(d);
  }

  const getHourArr = (hour, fromZero = true) => {
    const arr = [];
    times.forEach((obj) => {
      if (
        isValidDate(obj[hour]) &&
        obj[hour] !== null &&
        !Number.isNaN(new Date(obj[hour]).getTime())
      ) {
        arr.push(format(obj[hour], fromZero ? 'HH:00' : 'HH:mm'));
      }
    });

    return arr;
  };

  const setFreshStartingDate = () => {
    if (duration !== 'Starting Now') return;

    setStartingDate(new Date());
    setTypeSchedule('now');
    setTimes([
      {
        startTime: new Date(
          null,
          null,
          null,
          Number(format(new Date(), 'HH')),
          Number(format(new Date(addMinutes(new Date(), 2)), 'mm')),
          null,
          null
        ),
        endTime: new Date(
          null,
          null,
          null,
          Number(format(new Date(addHours(new Date(), 1)), 'HH')),
          0
        ),
        pos: 1,
      },
    ]);
  };

  const clearTimeSelected = () => {
    const clonedheatmapData = { ...heatmapData };

    days.forEach((day, index) => {
      if (!clonedheatmapData.revenue?.[index]) return;

      _.range(minHour, maxHour + 1).forEach((num) => {
        if (!clonedheatmapData.revenue[index]?.[num]) return;

        delete clonedheatmapData.revenue[index][num]?.active;
      });
    });

    days.forEach((__, index) => {
      if (!clonedheatmapData.orders?.[index]) return;

      _.range(minHour, maxHour + 1).forEach((num) => {
        if (!clonedheatmapData.orders[index]?.[num]) return;

        delete clonedheatmapData.orders[index][num]?.active;
      });
    });

    setHeatmapData({ ...heatmapData, ...clonedheatmapData });
  };

  useEffect(() => {
    if (duration === 'Starting Now') {
      setFreshStartingDate();
    } else {
      setTypeSchedule('Continues Offer');
      setTimes([
        {
          startTime: new Date(null, null, null, Number(format(new Date(), 'HH')), 0),
          endTime: new Date(null, null, null, Number(format(new Date(), 'HH')), 0),
          pos: 1,
        },
      ]);
      clearTimeSelected();
    }
  }, [duration]);

  useEffect(() => {
    if (typeSchedule !== 'customised Days') {
      setCustomisedDay([]);
    }
    setTimes([
      {
        startTime: new Date(
          null,
          null,
          null,
          Number(format(new Date(), 'HH')),
          null,
          Number(format(new Date(addMinutes(new Date(), 2)), 'mm')),
          null
        ),
        endTime: new Date(null, null, null, Number(format(addHours(new Date(), 1), 'HH')), 0),
        pos: 1,
      },
    ]);
  }, [typeSchedule]);
  const typeScheduleObj = {
    'Continues Offer': 'once',
    'Every Day': 'everyday',
    'Work Week': 'workweek',
    'Same day every week': everyWeek.toLowerCase().replace('every', '').split(' ').join(''),
    'Customised Days': customisedDay.toString().toLowerCase().replace(/,/g, '.'),
  };

  const getTypeSchedule = () => typeScheduleObj[typeSchedule] || 'now';

  const targetAudienceObj = {
    'New customer': 'new_customers',
    'Deliveroo plus': 'subscribers',
    'Inactive customers': 'lapsed_customers',
  };

  const getTargetAudience = () => targetAudienceObj[targetAudience] || 'orders';

  const getMenuItem = () => {
    const arr = [];
    category.forEach((obj) => {
      checked.forEach((c) => {
        if (obj.name || obj.item_name === c) {
          arr.push({ id: obj.id || obj.item_id, drn_id: obj.metadata.drn_id });
        }
      });
    });
    return arr;
  };

  useEffect(() => {
    const newChainObj = JSON.parse(JSON.stringify(vendors.chainObj));
    const newVendorsObj = { talabat: [], deliveroo: [] };
    Object.keys(newChainObj).forEach((chainName, index) => {
      Object.keys(newChainObj[chainName]).forEach((vendorName) => {
        if (index !== 0) {
          delete newChainObj[chainName][vendorName];
        } else {
          platform.forEach((p) => {
            newVendorsObj[p]?.push(newChainObj[chainName][vendorName][p]);
          });
        }
      });
    });
    setBranch({
      ...vendors,
      vendorsObj: newVendorsObj,
      chainObj: newChainObj,
      vendorsSelected:
        [
          vendors.vendorsArr.filter((v) =>
            platform.find(
              (p) =>
                v.platform === p &&
                (v.metadata.is_active === 'True' || v.metadata.is_active === true)
            )
          )[0],
        ] || [],
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
    return branch.vendorsSelected[0].access_token ?? branch.vendorsSelected[0].access_token_bis;
  };
  const handleSchedule = async () => {
    let isStartingFromZero = true;
    if (duration === 'Starting Now') {
      setFreshStartingDate();
      isStartingFromZero = false;
    }

    const menuType =
      menu === 'Offer on the whole Menu' || platform[0] === 'talabat'
        ? null
        : { menu_items: getMenuItem(), theme: getDiscountMovType('type') };

    const dataReq = {
      start_date: format(startingDate, 'yyyy-MM-dd'),
      start_hour: getHourArr('startTime', isStartingFromZero),
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
      vendors: [{}],
      chain_id: '',
    };

    try {
      if (platform.length < 2) {
        setTriggerLoading(true);
        const res = await triggerOffers(platform[0], {
          ...dataReq,
          vendors: branch.vendorsSelected,
          chain_id: String(branch.vendorsSelected[0].chain_id),
        });

        if (res instanceof Error) {
          throw new Error(res.message);
        }

        setCreated(true);
        setRecap(false);
        setChecked([]);
        setTriggerLoading(false);
      } else {
        const crossPlatform = platform.map(async (p) => {
          setTriggerLoading(true);
          const newBranchData = branch.vendorsObj[p][0];
          const clonedVendor = JSON.parse(JSON.stringify(newBranchData || {}));
          delete clonedVendor.platform;

          return triggerOffers(p, {
            ...dataReq,
            vendors: [clonedVendor],
          });
        });

        Promise.all(crossPlatform)
          .then(([platform1, platform2]) => {
            if (platform1 instanceof Error) {
              throw new Error(platform1.message);
            }

            if (platform2 instanceof Error) {
              throw new Error(platform2.message);
            }
            setCreated(true);
            setRecap(false);
            setChecked([]);
            setTriggerLoading(false);
          })
          .catch((err) => {
            triggerAlertWithMessageError(err.message);
            setTriggerLoading(false);
          });
      }
    } catch (error) {
      triggerAlertWithMessageError(error.message);
      setTriggerLoading(false);
    }
  };

  const setHeatmapRangeFromState = () => {
    setRangeColorIndices(() => {
      const heatmaRangePlatform = revenueData?.[platform[0]].ranges;
      const ordersRangePlatform = ordersData?.[platform[0]].ranges;

      if (!heatmaRangePlatform || !ordersRangePlatform) {
        return {
          revenue: defaultRangeColorIndices,
          orders: defaultRangeColorIndices,
        };
      }

      return {
        revenue: heatmaRangePlatform,
        orders: ordersRangePlatform,
      };
    });
  };

  const setHeatmatDataFromState = () => {
    setHeatmapData(() => {
      if (!revenueData || !ordersData) return null;

      const heatmaDataPlatform = { ...revenueData?.[platform[0]].heatmap };
      const ordersDataPlatform = { ...ordersData?.[platform[0]].heatmap };

      if (!heatmaDataPlatform || !ordersDataPlatform) {
        return {
          revenue: defaultHeatmapState,
          orders: defaultHeatmapState,
        };
      }

      return {
        revenue: heatmaDataPlatform,
        orders: ordersDataPlatform,
      };
    });
  };

  useEffect(() => {
    if (heatmapLoading) return;

    setHeatmatDataFromState();
    setHeatmapRangeFromState();
  }, [JSON.stringify(platform), revenueData, ordersData, heatmapLoading]);

  const getHeatmapData = () => {
    setHeatmapLoading(true);

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
        setHeatmapLoading(false);
        if (resRevenue instanceof Error || resOrders instanceof Error) {
          setHeatmapData({
            revenue: defaultHeatmapState,
            orders: defaultHeatmapState,
          });
          setRangeColorIndices({
            revenue: defaultRangeColorIndices,
            orders: defaultRangeColorIndices,
          });

          return;
        }

        if (!resRevenue.data || !resOrders.data) {
          setHeatmapData({
            revenue: defaultHeatmapState,
            orders: defaultHeatmapState,
          });
          setRangeColorIndices({
            revenue: defaultRangeColorIndices,
            orders: defaultRangeColorIndices,
          });

          return;
        }

        setOrdersData(resOrders.data);
        setRevenueData(resRevenue.data);
      }
    );
  };

  useEffect(() => {
    if (!vendorsObj) return;

    if (!active) return;

    getHeatmapData();
  }, [JSON.stringify(beforePeriodBtn), JSON.stringify(vendorsObj), active]);

  const getPlatform = (e, radio) => {
    const { value } = e.target;
    if (radio) {
      if (e.target.checked) {
        setPlatform([value]);
        return;
      }
    }
    if (e.target.checked) {
      setPlatform([...platform, value]);
      return;
    }
    if (!e.target.checked) {
      platform.splice(
        platform.findIndex((el) => el === value),
        1
      );
    }
    setPlatform([...platform]);
  };

  const disableWeekends = (date) => date.getDay() === 0 || date.getDay() === 6;

  const onChange = (newValue, setDate) => {
    setDate(newValue);
    const date = document.querySelectorAll('.date-error');
    const arr = [];
    date.forEach((el) => arr.push(el.children[0].classList.contains('Mui-error')));
    setDisabledDate(arr.every((bool) => bool === false));
  };

  const getMenuData = async (vendor, platforms) => {
    try {
      setCategoryLoading(true);
      const res = await getMenu(
        { master_email: user.email, access_token: user.accessToken, vendor },
        platforms
      );

      if (!res.data) {
        throw new Error('');
      }
      if (res.data.menu_items === null) {
        setCategory(null);
        setCategoryLoading(false);
      } else {
        const resp = Object.keys(res.data.menu_items)
          .map((v) => res.data.menu_items[v])
          .map((k) => Object.keys(k).map((el) => k[el]))
          .flat();
        setCategory(resp);
        setCategoryLoading(false);
      }

      if (res.data.categories) {
        setCategoryDataList(res.data.categories);
      }

      // const resp = Object.keys(res.data.menu_items)
      //   .map((v) => res.data.menu_items[v])
      //   .map((k) => Object.keys(k).map((el) => k[el]))
      //   .flat();
      //   console.log(resp);
      // setCategoryDataList(res.data.categories);
      // setCategory(resp);
    } catch (err) {
      setCategory([]);
      setCategoryLoading(false);
      triggerAlertWithMessageError('Error while retrieving data');
    }
  };

  useEffect(() => {
    if (selected === 2) {
      if (platform.length < 2 && branch) {
        const vendorDisplay = vendors.vendorsObj[platform[0]][0];
        getMenuData(vendorDisplay, platform[0]);
      }
    }
  }, [platform, selected]);

  const [categorySearch, setCategorySearch] = useState('');
  const handleCategoryDataChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      const arr = value
        .map((v) => category.filter((k) => k.category_name === v || k.category === v))
        .flat();
      if (categorySearch) {
        const filtered = arr.filter((obj) =>
          (obj.name || obj.item_name).toLowerCase().includes(categorySearch.toLowerCase())
        );
        setFilteredCategoryData(filtered);
      } else {
        setFilteredCategoryData(arr);
      }
    } else {
      setFilteredCategoryData([]);
    }
    setCategoryData(value);
  };

  const timeSelected = () => {
    if (duration !== 'Starting Now' && selected === 3) return;

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
      typeSchedule === 'Customised Days',
      customisedDay,
      typeSchedule === 'Same day every week',
      everyWeek
    );

    setHeatmapData({ ...heatmapData, [links]: response });
  };

  const getSteps = (stepsArr) => {
    if (platform.length < 2) {
      if (platform[0] === 'talabat') {
        setSteps(stepsArr);
      } else {
        setSteps([...stepsArr, stepsArr.length]);
      }
    } else {
      setSteps([...stepsArr, stepsArr.length]);
    }
  };

  const durationDisable = (n, stepsRange) => {
    if (selected === n) {
      clearTimeSelected();
      timeSelected();
      if (duration === 'Program the offer duration') {
        getSteps([...stepsRange, stepsRange.length]);
        setDisabled(!typeSchedule);
        return;
      }
      getSteps(stepsRange);
      setDisabled(
        !(
          endingDate !== null &&
          disabledDate &&
          times.every(
            (obj) =>
              isValidDate(obj.endTime) &&
              obj.startTime !== null &&
              !Number.isNaN(new Date(obj.endTime).getTime())
          )
        )
      );
      return;
    }
    if (selected === n + 1) {
      setDisabled(!targetAudience);
    }
    if (duration === 'Program the offer duration') {
      if (selected === n + 1) {
        timeSelected();
        if (typeSchedule === 'Same day every week') {
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
                  !Number.isNaN(new Date(obj.startTime).getTime())
              )
            )
          );
          return;
        }
        if (typeSchedule === 'Customised Days') {
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
                  !Number.isNaN(new Date(obj.startTime).getTime())
              )
            )
          );
          return;
        }
        if (typeSchedule !== 'Customised Day' && typeSchedule !== 'Same day every week') {
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
                  !Number.isNaN(new Date(obj.startTime).getTime())
              )
            )
          );
        }
      }
      if (selected === n + 2) {
        setDisabled(!targetAudience);
      }
    }
  };

  useEffect(() => {
    if (selected === 1) {
      getSteps([0, 1, 2, 3]);
      setFilteredCategoryData([]);
      setCategory([]);
      setChecked([]);
      setCategoryData([]);
      setMenu('Offer on the whole Menu');
      if (Object.keys(vendors.display).length > 0) {
        setDisabled(!(branch && platform.length));
        return;
      }

      setDisabled(false);
      return;
    }
    if (selected === 2) {
      clearTimeSelected();
      if (menu === 'Offer on An Item from the Menu') {
        getSteps([0, 1, 2, 3, 4]);
        if (platform[0] === 'talabat') {
          setDisabled(!(menu && discountPercentage));
          return;
        }
        setDisabled(!(menu && discountPercentage && minOrder && itemMenu));
        return;
      }
      getSteps([0, 1, 2, 3]);
      setDisabled(!(menu && discountPercentage && minOrder));
      return;
    }
    if (menu === 'Offer on An Item from the Menu') {
      if (selected === 3) {
        setDisabled(checked.length === 0);
        return;
      }
      durationDisable(4, [0, 1, 2, 3, 4]);
    }
    if (menu === 'Offer on the whole Menu') {
      durationDisable(3, [0, 1, 2, 3]);
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
    typeSchedule,
    disabledDate,
    times,
    everyWeek,
    customisedDay,
    itemMenu,
    checked,
    vendors,
    targetAudience,
  ]);

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
  const renderTooltipContent = (data, num) => (
    <div className='heatmap-tooltip'>
      <div className='heatmap-tooltip__item'>
        <span className='__item-text'>
          Daily {links} up to {rangeHoursOpenedDay[num].label}
        </span>
        <span className='__item-value'>
          {data.x_accrued_intra_day}&nbsp;{links === 'revenue' ? 'AED' : ''}
        </span>
      </div>
      <div className='heatmap-tooltip__item'>
        <span className='__item-text'>
          <span style={{ textTransform: 'capitalize', fontSize: 12 }}>{links}</span> generated at{' '}
          {rangeHoursOpenedDay[num].label}
        </span>
        <span className='__item-value'>
          {data.x_timeslot}&nbsp;{links === 'revenue' ? 'AED' : ''}
        </span>
      </div>
      <div className='heatmap-tooltip__item'>
        <span className='__item-text'>
          Daily {links} in % at {rangeHoursOpenedDay[num].label}{' '}
        </span>
        <span className='__item-value'>
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
    setChecked([]);
    body.style.overflowY = 'visible';
  };

  useEffect(() => {
    setSelected(1);
    setRecap(false);
  }, [active]);

  useEffect(() => {
    setItemMenu('Flash Deal');
  }, [menu]);

  useEffect(() => {
    clearTimeSelected();
    if (selected >= 3) {
      timeSelected();
    }
  }, [times, startingDate, endingDate, selected, typeSchedule]);

  useEffect(() => {
    setFreshStartingDate();
  }, [recap]);

  const getItemMenuNamePrice = () => {
    const arr = [];
    checked.forEach((c) => {
      category.forEach((obj) =>
        obj.name === c || obj.item_name === c
          ? arr.push({ name: obj.name || obj.item_name, price: obj.price || obj.unit_price })
          : false
      );
    });
    return arr;
  };

  const progressData = {
    selected,
    getPlatform,
    platform,
    handleCategoryDataChange,
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
    categoryLoading,
    categorySearch,
    setCategorySearch,
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
    typeSchedule,
    customisedDay,
    everyWeek,
    startingDate,
    endingDate,
    times,
    targetAudience,
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
      background: `linear-gradient(45deg, #2D99FF 9%, ${el.color} 1%, ${el.color} 42%, #2D99FF 44%, #2D99FF 62%, ${el.color} 1%, ${el.color} 93%, #2D99FF 1%)`,
      backgroundSize: '6px 6px',
      backgroundPosition: '50px 50px',
    };
  };

  const renderSkeleton = (num) => (
    <TypographyKit style={{ '--i': num - 5 }} className='absolute loading' key={num}>
      <span />
    </TypographyKit>
  );

  const renderCells = () =>
    days.map((obj, index) => (
      <TypographyKit key={obj} variant='div'>
        {_.range(minHour, maxHour + 1).map((num) => {
          if (heatmapLoading || !heatmapData?.[links]) return renderSkeleton(num);
          if (heatmapData[links][index]?.[num] && heatmapData[links][index][num]?.data)
            return (
              <TypographyKit
                component='div'
                style={{ '--i': num - 5 }}
                className='absolute'
                key={num}
              >
                <Tooltip
                  placement='top-start'
                  title={renderTooltipContent(heatmapData[links][index][num].data, num)}
                  arrow
                >
                  <ItemHeatmap>
                    <TypographyKit
                      className='heatmap-btn '
                      sx={getStyleHashureActive(heatmapData[links][index][num])}
                    >
                      <span>&nbsp;</span>
                    </TypographyKit>
                  </ItemHeatmap>
                </Tooltip>
              </TypographyKit>
            );

          if (heatmapData[links][index]?.[num] && heatmapData[links][index][num]?.active) {
            return (
              <TypographyKit
                component='div'
                style={{ '--i': num - 5 }}
                className='absolute active'
                key={num}
              >
                <span>&nbsp;</span>
              </TypographyKit>
            );
          }

          return (
            <TypographyKit
              component='div'
              style={{ '--i': num - 5 }}
              className='absolute'
              key={num}
            >
              <span>&nbsp;</span>
            </TypographyKit>
          );
        })}
      </TypographyKit>
    ));

  const renderLeftSideNotCreated = () => {
    if (triggerLoading)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SpinnerKit />
            <p
              style={{
                fontSize: '14px',
                textAlign: 'center',
                fontWeight: '600',
                marginTop: '1rem',
              }}
            >
              Getting everything ready...
            </p>
          </div>
        </div>
      );

    return (
      <div className='left-part-bottom'>
        <ButtonKit onClick={() => handleBack()} variant='outlined' disabled={selected < 2}>
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
              setDisabled(true);
            }
          }}
          disabled={disabled}
          variant='contained'
        >
          {getRecapBtn()}
        </ButtonKit>
      </div>
    );
  };

  const renderIndiceColor = () => {
    if (!rangeColorIndices || !rangeColorIndices[links] || heatmapLoading)
      return [0, 0, 0, 0].map(() => (
        <SkeletonKit key={nanoid()} variant='rectangular' width={170} height={25} />
      ));

    return rangeColorIndices[links]?.map((r, i) => (
      <TypographyKit key={nanoid()}>{renderGradientValue(r, i)}</TypographyKit>
    ));
  };

  return (
    <div className={`marketing-setup-offer${active ? ' active ' : ''}`}>
      <PaperKit id='marketing-setup' className='marketing-paper'>
        <ContainerKit className='setup-container'>
          <div className='left-part'>
            {triggerLoading ? null : <GetRecap recapData={recapData} />}
            {created ? (
              <div className='left-part-bottom'>
                <ButtonKit onClick={() => closeSetup()} variant='outlined'>
                  CLose
                </ButtonKit>
              </div>
            ) : (
              renderLeftSideNotCreated()
            )}
          </div>
          <div className='right-part'>
            <div className='right-part-header'>
              <TypographyKit
                className={`right-part-header_link setup ${links === 'orders' ? 'active' : ''}`}
                variant='div'
              >
                <BoxKit
                  className={links === 'revenue' ? 'active' : ''}
                  onClick={() => setLinks('revenue')}
                >
                  <img src={RevenueHeatMapIcon} alt='Revenue Heat Map Icon' />
                  Revenue
                </BoxKit>
                <BoxKit
                  className={links === 'orders' ? 'active' : ''}
                  onClick={() => setLinks('orders')}
                >
                  <img src={PlatformIcon} alt='Order Heat Map Icon' />
                  Orders
                </BoxKit>
              </TypographyKit>
              <Dates
                isMarketingHeatMap
                defaultTypeDate='week'
                defaultTitle='last week'
                beforePeriodBtn={beforePeriodBtn}
                setbeforePeriodBtn={setBeforePeriodBtn}
                setupOffer
              />
            </div>
            <TypographyKit variant='div' className='right-part-main'>
              <TypographyKit className='right-part-main-title' variant='div'>
                <TypographyKit
                  variant='div'
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <TypographyKit variant='h6' style={{ fontSize: '15px' }}>
                    Min {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('MM-DD')}
                  </TypographyKit>
                  <TypographyKit variant='h6' style={{ fontSize: '15px' }}>
                    Max {links === 'revenue' ? 'revenue' : 'number of orders'} from{' '}
                    {dayjs(beforePeriodBtn.startDate).format('MM-DD')} to{' '}
                    {dayjs(beforePeriodBtn.endDate).format('MM-DD')}
                  </TypographyKit>
                </TypographyKit>
                <TypographyKit variant='div' className='color-btns'>
                  {renderIndiceColor()}
                </TypographyKit>
              </TypographyKit>
              <TypographyKit variant='div' sx={{ display: 'flex', margin: '30px 0' }}>
                <TypographyKit variant='div' className='right-part-main-hour'>
                  <TypographyKit style={{ paddingBottom: '15px' }}>
                    <img src={OpacityLogo} alt='Logo' />
                  </TypographyKit>
                  {_.range(minHour, maxHour + 1).map((num) => (
                    <TypographyKit key={num}>{rangeHoursOpenedDay[num].label ?? num}</TypographyKit>
                  ))}
                </TypographyKit>
                <TypographyKit sx={{ width: '100%' }} variant='div'>
                  <TypographyKit variant='div' className='right-part-main-day'>
                    {days.map((day) => (
                      <TypographyKit key={day}>{day.slice(0, 3)}</TypographyKit>
                    ))}
                  </TypographyKit>

                  <TypographyKit className='right-part-main-heatmap' variant='div'>
                    {days.map((day) => (
                      <TypographyKit key={day} variant='div'>
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
                    <div className='heatmap-btn_wrapper'>{renderCells()}</div>
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
