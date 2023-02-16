/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from '@mui/material';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import { useUserAuth } from 'contexts';
import { format } from 'date-fns';
import { useAlert, useApi, usePlatform, useMarketingSetup, useVendors } from 'hooks';
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
import dayjs from 'dayjs';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useState, type createRef } from 'react';
import {
  platformAtom,
  selectedAtom,
  linkAtom,
  menuAtom,
  discountPercentageAtom,
  minOrderPercentageAtom,
  durationAtom,
  disabledAtom,
  triggerLoadingAtom,
  beforePeriodBtnAtom,
  categoryDataListAtom,
  branchAtom,
  categoryDataAtom,
  startingDateAtom,
  endingDateAtom,
  typeScheduleAtom,
  disabledDateAtom,
  customisedDayAtom,
  timesAtom,
  everyWeekAtom,
  itemMenuAtom,
  categoryAtom,
  filteredCategoryDataAtom,
  targetAudienceAtom,
  createdAtom,
  recapAtom,
  stepsAtom,
  checkedAtom,
  categoryLoadingAtom,
  smRuleAtom,
  heatmapDataAtom,
  defaultHeatmapState,
  type TCategoryAtom,
  type THeatmapData,
  type TOfferDataResponse,
} from 'store/marketingSetupAtom';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import RevenueHeatMapIcon from '../../assets/images/ic_revenue-heatmap.png';
import PlatformIcon from '../../assets/images/ic_select_platform.png';
import OpacityLogo from '../../assets/images/opacity-logo.png';
import heatmapSelected, { getFormatedEndDate } from '../../utlls/heatmap/heatmapSelected';
import { maxHour, minHour, rangeHoursOpenedDay } from '../../utlls/heatmap/heatmapSelectedData';
import Dates from '../dates/Dates';
import GetRecap from './GetRecap';
import './MarketingSetup.scss';

const defaultRangeColorIndices = [0, 0, 0, 0];

const ItemHeatmap = React.forwardRef((props: { children: ReactNode }, ref: typeof createRef) => (
  <div {...props} ref={ref} />
));
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getMenuItem = (
  category: TCategoryAtom[],
  checked: string[]
): { id: string | number; drn_id: string | number }[] => {
  const arr = [];
  category.forEach((obj) =>
    checked.forEach((c) => {
      if (!obj.name && obj.item_name !== c) return;
      arr.push({ id: obj.id || obj.item_id, drn_id: obj.metadata.drn_id });
    })
  );
  return arr;
};

const getItemMenuNamePrice = (
  checked: string[],
  category: TCategoryAtom[]
): { name: string; price: number }[] => {
  const arr = [];
  checked.forEach((c) => {
    category.forEach((obj) => {
      if (obj.name !== c && obj.item_name !== c) return;
      arr.push({ name: obj.name || obj.item_name, price: obj.price || obj.unit_price });
    });
  });
  return arr;
};

const clearTimeSelected = (heatmapData: THeatmapData): THeatmapData => {
  const clonedheatmapData = { ...heatmapData };

  days.forEach((__, index) => {
    if (!clonedheatmapData.revenue?.[index]) return;

    _.range(minHour, maxHour + 1).forEach((num: number) => {
      if (clonedheatmapData.revenue?.[index] && clonedheatmapData.revenue[index]?.[num]) {
        delete clonedheatmapData.revenue[index][num]?.active;
      }

      if (clonedheatmapData.orders?.[index] && clonedheatmapData.orders[index]?.[num]) {
        delete clonedheatmapData.orders[index][num]?.active;
      }
    });
  });

  return { ...heatmapData, ...clonedheatmapData };
};

const MarketingSetup: React.FC<{
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line react/require-default-props
  ads?: boolean;
}> = ({ active, setActive, ads }) => {
  const { getActivePlatform } = usePlatform();

  const [platform, setPlatform] = useAtom(platformAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [links, setLinks] = useAtom(linkAtom);
  const [menu, setMenu] = useAtom(menuAtom);
  const [discountPercentage] = useAtom(discountPercentageAtom);
  const [minOrder] = useAtom(minOrderPercentageAtom);
  const [duration] = useAtom(durationAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [triggerLoading, setTriggerLoading] = useAtom(triggerLoadingAtom);
  const [beforePeriodBtn, setBeforePeriodBtn] = useAtom(beforePeriodBtnAtom);
  const [, setCategoryDataList] = useAtom(categoryDataListAtom);
  const [, setCategoryData] = useAtom(categoryDataAtom);
  const [startingDate, setStartingDate] = useAtom(startingDateAtom);
  const [endingDate] = useAtom(endingDateAtom);
  const [typeSchedule, setTypeSchedule] = useAtom(typeScheduleAtom);
  const [disabledDate] = useAtom(disabledDateAtom);
  const [branch, setBranch] = useAtom(branchAtom);
  const [customisedDay, setCustomisedDay] = useAtom(customisedDayAtom);
  const [everyWeek] = useAtom(everyWeekAtom);
  const [itemMenu, setItemMenu] = useAtom(itemMenuAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const [, setFilteredCategoryData] = useAtom(filteredCategoryDataAtom);
  const [targetAudience] = useAtom(targetAudienceAtom);
  const [created, setCreated] = useAtom(createdAtom);
  const [recap, setRecap] = useAtom(recapAtom);
  const [times, setTimes] = useAtom(timesAtom);

  const [smRule, setSmRule] = useAtom(smRuleAtom);
  const [steps, setSteps] = useAtom(stepsAtom);

  const [checked, setChecked] = useAtom(checkedAtom);
  const [, setCategoryLoading] = useAtom(categoryLoadingAtom);
  const { vendors } = useVendors();
  const { vendorsObj } = vendors;

  useEffect(() => {
    setPlatform([getActivePlatform()]);
    setBranch({ ...vendors });
  }, [vendors]);

  const { getHeatmap, triggerOffers, getMenu } = useApi();
  const { user } = useUserAuth();
  const { triggerAlertWithMessageError } = useAlert();
  const {
    setStartTimeFormat,
    setEndTimeFormat,
    getHourArr,
    isValidDate,
    getDiscountMovType,
    getTargetAudience,
    getTypeSchedule,
  } = useMarketingSetup();

  const [heatmapData, setHeatmapData] = useAtom(heatmapDataAtom);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [rangeColorIndices, setRangeColorIndices] = useState({
    revenue: defaultRangeColorIndices,
    orders: defaultRangeColorIndices,
  });

  const [revenueData, setRevenueData] = useState<{
    [x: string]: {
      heatmap: { [x: number]: { [x: number]: TOfferDataResponse } };
      ranges: number[];
    };
  } | null>(null);
  const [ordersData, setOrdersData] = useState<{
    [x: string]: {
      heatmap: { [x: number]: { [x: number]: TOfferDataResponse } };
      ranges: number[];
    };
  } | null>(null);

  const setFreshStartingDate = () => {
    if (duration !== 'Starting Now') return;

    setStartingDate(new Date());
    setTypeSchedule('now');
    setTimes([
      {
        startTime: setStartTimeFormat(new Date(), 2),
        endTime: setEndTimeFormat(times[0].endTime, false),
        pos: 1,
      },
    ]);
  };

  useEffect(() => {
    if (duration === 'Starting Now') {
      setFreshStartingDate();
      return;
    }

    setTypeSchedule('Continues Offer');
    setTimes([
      {
        startTime: setStartTimeFormat(new Date(), 2),
        endTime: setStartTimeFormat(new Date(), 0),
        pos: 1,
      },
    ]);

    setHeatmapData(clearTimeSelected(heatmapData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  useEffect(() => {
    if (typeSchedule !== 'customised Days') {
      setCustomisedDay([format(new Date(), 'EEEE')]);
    }

    setTimes([
      {
        startTime: setStartTimeFormat(new Date(), 2),
        endTime: setEndTimeFormat(new Date(), true),
        pos: 1,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSchedule]);

  useEffect(() => {
    setHeatmapData(clearTimeSelected(heatmapData));
    if (selected >= 3) {
      timeSelected();
    }
  }, [times, startingDate, endingDate, selected, typeSchedule]);

  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    const vendorsObjTemp = JSON.parse(JSON.stringify(vendors.vendorsObj));
    sortedVendors(displayTemp).forEach((chainName) => {
      Object.keys(displayTemp[chainName]).forEach((vendorName) => {
        displayTemp[chainName][vendorName].checked = false;
        if (platform.length > 1 && !displayTemp[chainName][vendorName].is_matched) {
          displayTemp[chainName][vendorName].deleted = true;
        } else {
          Object.keys(displayTemp[chainName][vendorName].platforms).forEach((platformV) => {
            if (platform[0] !== platformV && !displayTemp[chainName][vendorName].is_matched) {
              displayTemp[chainName][vendorName].deleted = true;
            }
          });
        }
      });
    });

    sortedVendors(displayTemp)
      .filter((cName) =>
        Object.keys(displayTemp[cName]).every(
          (vName) => !(displayTemp[cName][vName].deleted || false)
        )
      )
      .forEach((chainName, indexC) => {
        Object.keys(displayTemp[chainName]).forEach((vendorName, indexV) => {
          if (indexC === 0 && indexV === 0) {
            displayTemp[chainName][vendorName].checked = true;
            Object.keys(displayTemp[chainName][vendorName].platforms).forEach((plat) => {
              if (platform.length > 1) {
                vendorsObjTemp[plat] = [displayTemp[chainName][vendorName].platforms[plat]];
              } else if (platform[0] === plat) {
                vendorsObjTemp[plat] = [displayTemp[chainName][vendorName].platforms[plat]];
              } else {
                delete vendorsObjTemp[plat];
              }
            });
          } else {
            displayTemp[chainName][vendorName].checked = false;
          }
        });
      });
    setBranch({
      ...vendors,
      display: displayTemp,
      vendorsObj: vendorsObjTemp,
    });
    setMenu('Offer on the whole Menu');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, vendors]);

  const handleSchedule = async () => {
    let isStartingFromZero = true;
    if (duration === 'Starting Now') {
      setFreshStartingDate();
      isStartingFromZero = false;
    }

    const menuType =
      menu === 'Offer on the whole Menu'
        ? null
        : { menu_items: getMenuItem(category, checked), theme: getDiscountMovType('type') };

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
      platform_token: '',
      vendors: [{}],
      chain_id: '',
    };

    try {
      if (platform.length < 2) {
        setTriggerLoading(true);
        const selectedVendorsData = selectedVendors('full', branch.display, platform[0]);

        const res = await triggerOffers(platform[0], {
          ...dataReq,
          vendors: selectedVendorsData,
          chain_id: selectedVendorsData[0].chain_id, // Get the first chain id
          platform_token:
            selectedVendorsData[0].access_token ?? selectedVendorsData[0].access_token_bis, // Get the first access token
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
          const selectedVendorsData = selectedVendors('full', branch.display, p);

          return triggerOffers(p, {
            ...dataReq,
            vendors: selectedVendorsData,
            chain_id: selectedVendorsData[0].chain_id,
            platform_token:
              selectedVendorsData[0].access_token ?? selectedVendorsData[0].access_token_bis,
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
      const heatmaRangePlatform = revenueData?.[platform[0]]?.ranges;
      const ordersRangePlatform = ordersData?.[platform[0]]?.ranges;

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

      const heatmaDataPlatform = revenueData?.[platform[0]]?.heatmap;
      const ordersDataPlatform = ordersData?.[platform[0]]?.heatmap;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatmapLoading]);

  const getHeatmapData = () => {
    setHeatmapLoading(true);
    const selectedVendorsDeliveroo = selectedVendors('full', branch.display, 'deliveroo');
    const selectedVendorsDataTalabat = selectedVendors('full', branch.display, 'talabat');

    const body = {
      master_email: user.email,
      access_token: user.accessToken,
      start_date: dayjs(beforePeriodBtn.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(beforePeriodBtn.endDate).format('YYYY-MM-DD'),
      colors: ['#EDE7FF', '#CAB8FF', '#906BFF', '#7E5BE5'],
      vendors: {
        ...(selectedVendorsDeliveroo &&
        selectedVendorsDeliveroo.length > 0 &&
        selectedVendorsDeliveroo.some((d) => d)
          ? { deliveroo: selectedVendorsDeliveroo.filter((d) => d) }
          : {}),
        ...(selectedVendorsDataTalabat &&
        selectedVendorsDataTalabat.length > 0 &&
        selectedVendorsDataTalabat.some((d) => d)
          ? { talabat: selectedVendorsDataTalabat.filter((d) => d) }
          : {}),
      },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforePeriodBtn, vendorsObj, active, branch.display]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, selected]);

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

    if (
      (menu === 'Offer on An Item from the Menu' && selected >= 4) ||
      (menu === 'Offer on the whole Menu' && selected >= 3)
    ) {
      setHeatmapData({ ...heatmapData, [links]: response });
    }
  };

  const getSteps = (stepsArr: number[]) => {
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

  const durationDisable = (n: number, stepsRange: number[]) => {
    if (selected === n) {
      setHeatmapData(clearTimeSelected(heatmapData));
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
      setHeatmapData(clearTimeSelected(heatmapData));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    vendors,
    targetAudience,
    checked,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    setItemMenu('Flash Deal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  useEffect(() => {
    setFreshStartingDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recap]);

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
      return;
    }

    if (smRule) {
      setSmRule(false);
      return;
    }

    setSelected(selected - 1);
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
            {triggerLoading ? null : (
              <GetRecap
                getItemMenuNamePrice={() => getItemMenuNamePrice(checked, category)}
                closeSetup={closeSetup}
                ads={ads}
              />
            )}
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
