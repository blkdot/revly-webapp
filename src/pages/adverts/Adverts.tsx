import { useEffect, useState } from 'react';
import Dates from 'components/dates/Dates';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { endOfMonth, format, getYear, subDays } from 'date-fns';
import { ButtonKit, PaperKit, SkeletonKit, TableCellKit, TableRowKit, TypographyKit } from 'kits';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import dayjs from 'dayjs';
import { enUS } from 'date-fns/locale';
import { useDate, usePlanningAds } from 'hooks';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import './Adverts.scss';
import shortid from 'shortid';
import arrow from 'assets/images/arrow.svg';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from 'components/tableRevly/TableRevly';
import EyeIcon from 'assets/images/eye.svg';
import ShoppingBagIcon from 'assets/images/shopping-bag.svg';
import GraphIcon from 'assets/images/graph.svg';
import SmileIcon from 'assets/images/smile.svg';

const Adverts = () => {
  const { date } = useDate();
  const [vendors] = useAtom(vendorsAtom);
  const { display, vendorsArr } = vendors;
  const { beforePeriod, titleDate } = date;
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: beforePeriod.startDate,
    endDate: beforePeriod.endDate,
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
  const [row, setRow] = useState([]);
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
      start_end_hour: `${dayjs(obj.valid_from).format('HH:mm a')} - ${dayjs(obj.valid_to).format(
        'HH:mm a'
      )}`,
      impressions: { title: obj.ad_serving_count, src: EyeIcon },
      orders: { title: obj.orders_count, src: ShoppingBagIcon },
      clicks: { title: obj.clicks_count, src: GraphIcon },
      customers: { title: obj.new_customers_count, src: SmileIcon },
    }));
    setAdsData(newArr);
    setRow(newArr);
  }, [ads]);
  const headersList = [
    { id: 'chain_id', disablePadding: true, label: 'Brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    { id: 'start_end_date', disablePadding: true, label: 'Start/Ending Date' },
    { id: 'start_end_hour', disablePadding: true, label: 'Start/Ending Hour' },
    { id: 'total_budget', disablePadding: true, label: 'Total Budget' },
    { id: 'spend', disablePadding: true, label: 'Budget Spent' },
    { id: 'return_on_ad_spent', disablePadding: true, label: 'Return on Spent' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
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
  } = useTableContentFormatter();
  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    start_end_date: renderSimpleRow,
    start_end_hour: renderSimpleRow,
    total_budget: renderCurrency,
    spend: renderCurrency,
    return_on_ad_spent: renderCurrency,
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
        id: `${cur.id}_${r.ad_id}_ads_${shortid.generate()}`,
        data: r,
      }),
      {}
    );
  const skeletons = (h) => {
    if (h.id === 'vendor_ids' || h.id === 'platform') {
      return <SkeletonKit variant='circular' width={40} height={40} />;
    }
    return <SkeletonKit />;
  };
  const renderSkeleton = () =>
    [1, 2, 3, 4, 5].map((n) => (
      <TableRowKit key={n}>
        {(link === 'list' ? headersList : headersPerformance).map((h) => (
          <TableCellKit key={h.id}>{skeletons(h)}</TableCellKit>
        ))}
      </TableRowKit>
    ));

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates offer beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <div className='adverts_top-titles'>
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
      <PaperKit className='competition-paper adverts'>
        <div className='paper-top-link'>
          <div className='links'>
            <div>
              <p className={link === 'list' ? 'active' : ''}>Adverts List</p>
              <span>The list of your running adverts for Today</span>
            </div>
            <div>
              <p className={link === 'performence' ? 'active' : ''}>Adverts Performance</p>
              <span>Performance Metrics of you running adverts for Today</span>
            </div>
            <div className='arrows'>
              <img
                tabIndex={-1}
                role='presentation'
                onClick={() => setLink('list')}
                className={link !== 'list' ? 'active' : ''}
                src={arrow}
                alt='left-arrow'
              />
              <img
                tabIndex={-1}
                role='presentation'
                onClick={() => setLink('performence')}
                className={link !== 'performence' ? 'active' : ''}
                src={arrow}
                alt='right-arrow'
              />
            </div>
          </div>
          <ButtonKit>
            Create new campaign
            <img src={arrow} alt='right-arrow' />
          </ButtonKit>
        </div>
        <div className='adverts-table'>
          <TableRevly
            renderCustomSkelton={renderSkeleton}
            isLoading={isLoadingAds}
            headers={link === 'list' ? headersList : headersPerformance}
            rows={adsData.map(renderRowsByHeaderList)}
          />
        </div>
      </PaperKit>
    </div>
  );
};

export default Adverts;