import { useEffect, useState } from 'react';
import Dates from 'components/dates/Dates';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { endOfMonth, endOfWeek, format, getYear } from 'date-fns';
import { ButtonKit, TypographyKit } from 'kits';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import dayjs from 'dayjs';
import { enUS } from 'date-fns/locale';
import { useDate, usePlanningAds } from 'hooks';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import './Adverts.scss';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import arrow from 'assets/images/arrow.svg';
import AdvertsDetails from './details/AdvertsDetails';

const Adverts = () => {
  const { date } = useDate();
  const [vendors] = useAtom(vendorsAtom);
  const { display, vendorsArr } = vendors;
  const { beforePeriod, titleDate } = date;
  const getOfferDate = () => {
    if (date.typeDate === 'month') {
      return endOfMonth(new Date(date.beforePeriod.endDate));
    }
    if (date.typeDate === 'week') {
      return endOfWeek(new Date(date.beforePeriod.endDate), { weekStartsOn: 1 });
    }
    return date.beforePeriod.endDate;
  };
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: beforePeriod.startDate,
    endDate: getOfferDate(),
  });
  const [link, setLink] = useState('list');
  const startDate = new Date(beforePeriodBtn.startDate);
  const endDate = new Date(beforePeriodBtn.endDate);
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();

  const getbeforePeriod = () => {
    if (titleDate === 'custom') {
      if (startLocal === endLocal) {
        return `${dayjs(startDate).format('DD/MM')}`;
      }
      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        return `${format(startDate, 'LLL', { locale: enUS })}  -  ${getYear(startDate)}`;
      }

      return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM')}`;
    }

    return `${titleDate}`;
  };
  const isDisplay = () => {
    if (selectedVendors('name', display).length === vendorsArr.length) {
      return 'All Points of sales';
    }
    if (selectedVendors('name', display).length > 2) {
      return `${selectedVendors('name', display).length} selected vendors`;
    }
    return selectedVendors('name', display).join(', ');
  };
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange: beforePeriodBtn });
  const [adsData, setAdsData] = useState([]);
  useEffect(() => {
    const arr = [];
    Object.keys(vendors.vendorsObj).forEach((platform) => {
      vendors.vendorsObj[platform]?.forEach((v) =>
        ads.forEach((objAds) => {
          if (objAds.vendor_ids?.includes(Number(v.vendor_id)) && v.metadata.is_active) {
            arr.push(objAds);
          }
        })
      );
    });

    const newArr = arr.map((obj) => ({
      ...obj,
      start_end_date: `${dayjs(obj.valid_from).format('DD/MM')} - ${dayjs(obj.valid_to).format(
        'DD/MM'
      )}`,
      slot: `${dayjs(obj.valid_from).format('HH:mm')} - ${dayjs(obj.valid_to).format('HH:mm')}`,
      impressions: obj.ad_serving_count,
      orders: obj.orders_count,
      clicks: obj.clicks_count,
      customers: obj.new_customers_count,
      spent_total:
        obj.spend === null || obj.total_budget === null ? null : `${obj.spend}/${obj.total_budget}`,
    }));
    setAdsData(newArr);
  }, [ads]);
  const headersList = [
    { id: 'chain_id', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'start_end_date', disablePadding: true, label: 'Start - end date' },
    {
      id: 'slot',
      disablePadding: true,
      label: 'Slot',
      tooltip: 'Daily start and end hour of your offer, and the # of hours it is running daily.',
    },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    {
      id: 'spent_total',
      disablePadding: true,
      label: 'Budget spent - total',
      tooltip: 'Used budget compared to the defined budget',
    },
    {
      id: 'cost_per_click',
      disablePadding: true,
      label: 'Cost Per Click',
      tooltip:
        'Commonly referred to as CPC. You can either set the CPC manually or let the aggregator set a dynamic CPC, only available on Deliveroo.',
    },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const headersPerformance = [
    { id: 'chain_id', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'impressions', disablePadding: true, label: 'Impressions' },
    { id: 'orders', disablePadding: true, label: 'Orders' },
    { id: 'attributed_order_value', disablePadding: true, label: 'Attributed order value' },
    { id: 'clicks', disablePadding: true, label: 'Clicks' },
    { id: 'conversion_rate', disablePadding: true, label: 'Conversion rate' },
    { id: 'customers', disablePadding: true, label: 'New customers' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const {
    renderCurrency,
    renderStatus,
    renderChainId,
    renderSimpleRow,
    renderVendorId,
    renderPlatform,
    renderCalculatedPercent,
    renderSimpleIconRow,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderPercentSkeleton,
  } = useTableContentFormatter();
  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    start_end_date: renderSimpleIconRow,
    slot: renderSimpleIconRow,
    spent_total: renderCurrency,
    cost_per_click: renderCurrency,
    platform: renderPlatform,
    impressions: renderSimpleIconRow,
    orders: renderSimpleIconRow,
    attributed_order_value: renderCurrency,
    clicks: renderSimpleIconRow,
    conversion_rate: renderCalculatedPercent,
    customers: renderSimpleIconRow,
    status: renderStatus,
  };

  const renderRowsByHeaderList = (r) =>
    (link === 'list' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.master_ad_id }, cur),
        id: `${r.ad_ids.join('')}_ads_${r.master_ad_id}_${r.platform}`,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoading = {
    chain_id: renderSimpleRowSkeleton,
    vendor_ids: renderPlatformSkeleton,
    start_end_date: renderSimpleRowSkeleton,
    slot: renderSimpleRowSkeleton,
    spent_total: renderSimpleRowSkeleton,
    platform: renderPlatformSkeleton,
    impressions: renderSimpleRowSkeleton,
    orders: renderSimpleRowSkeleton,
    attributed_order_value: renderSimpleRowSkeleton,
    clicks: renderSimpleRowSkeleton,
    conversion_rate: renderSimpleRowSkeleton,
    customers: renderSimpleRowSkeleton,
    status: renderPercentSkeleton,
    cost_per_click: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderListLoading = (r) =>
    (link === 'list' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const [details, setDetails] = useState(false);
  const [clickedRow, setClickedRow] = useState({});
  const links = ['Ads management', 'Ads performance'];
  const renderLayout = () => {
    if (details) {
      return <AdvertsDetails />;
    }
    return (
      <div>
        <div className='adverts_top-titles'>
          <div>
            <TypographyKit className='adverts-title' variant='subtitle'>
              Manage Advertisements for
              <span>{isDisplay()}</span>
              for
              <span>{getbeforePeriod()}</span>
            </TypographyKit>
            <p>
              Here you can quickly and easily create and manage effective advertisements for their
              businesses.
            </p>
          </div>
          <ButtonKit>
            Create new campaign
            <img src={arrow} alt='right-arrow' />
          </ButtonKit>
        </div>
        <TableRevlyNew
          onClickRow={(id) => {
            setDetails(true);
          }}
          link={link}
          setLink={setLink}
          links={links}
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderListLoading)}
          isLoading={isLoadingAds}
          headers={link === 'list' ? headersList : headersPerformance}
          rows={adsData.map(renderRowsByHeaderList)}
        />
      </div>
    );
  };
  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates offer beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      {renderLayout()}
    </div>
  );
};

export default Adverts;
