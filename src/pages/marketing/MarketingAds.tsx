import { pascalCase } from 'change-case';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { DateRange, useDates } from 'contexts';
import { endOfMonth, endOfWeek } from 'date-fns';
import dayjs from 'dayjs';
import { usePlanningAds } from 'hooks';
import { ButtonKit, PaperKit, TypographyKit } from 'kits';
import { useEffect, useState } from 'react';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import logo from '../../assets/images/small-logo.png';
import MarketingOfferFilter from '../../components/marketingOfferFilter/MarketingOfferFilter';
import MarketingSetup from '../../components/marketingSetup/MarketingSetup';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import { platformObject } from '../../data/platformList';
import './Marketing.scss';
import { defaultFilterStateFormat } from './marketingOfferData';

const getOfferDate = (current: DateRange, type: string): Date => {
  if (type === 'month') {
    return endOfMonth(new Date(current.until.toDate()));
  }
  if (type === 'week') {
    return endOfWeek(new Date(current.until.toDate()), { weekStartsOn: 1 });
  }
  return current.until.toDate();
};

const MarketingAds = () => {
  const [active, setActive] = useState(false);
  const { current, typeDate } = useDates();

  const { ads, isLoading: isLoadingAds } = usePlanningAds({
    dateRange: {
      startDate: current.from.toDate(),
      endDate: getOfferDate(current, typeDate),
    },
  });

  const {
    renderPlatform,
    renderPercent,
    renderStatus,
    renderChainId,
    renderVendorId,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderSimpleIconRow,
    renderPercentSkeleton,
    renderCurrency,
  } = useTableContentFormatter();

  const [link, setLink] = useState('ads_managment');
  const links = [
    { title: 'Ads management', link: 'ads_managment' },
    { title: 'Ads performance', link: 'ads_performance' },
  ];

  const headersManagment = [
    { id: 'chain_id', disablePadding: true, label: 'Chain Name', tooltip: 'Your brand name' },
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
      id: 'spend',
      disablePadding: true,
      label: 'Budget spent - total',
      tooltip: 'Used budget compared to the defined budget',
    },
    { id: 'cost_per_click', disablePadding: true, label: 'Cost Per Click' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const headersPerformance = [
    { id: 'chain_id', disablePadding: true, label: 'Chain Name', tooltip: 'Your brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    {
      id: 'spend',
      disablePadding: true,
      label: 'Budget spent - total',
      tooltip: 'Used budget compared to the defined budget',
    },
    {
      id: 'revenue',
      disablePadding: true,
      label: 'Revenue',
      tooltip: 'Revenue generated by the offer',
    },
    {
      id: 'orders',
      disablePadding: true,
      label: 'Orders',
      tooltip: '# of orders generated by the offer',
    },
    {
      id: 'clicks',
      disablePadding: true,
      label: 'Clicks',
      tooltip: '# of customers who viewed your menu',
    },
    {
      id: 'impressions',
      disablePadding: true,
      label: 'Impressions',
      tooltip: '# of users who viewed your restaurant (branch) on the application',
    },
    {
      id: 'conversion_rate',
      disablePadding: true,
      label: 'Conversion rate',
      tooltip: '# of customers who placed an order out of # of customers who viewed your menu',
    },
    {
      id: 'return_on_ad_spent',
      disablePadding: true,
      label: 'Return on ad ',
      tooltip:
        'Return on Ad Spent (RoAD), # AED generated in Revenue for every 1 AED spent on Ads.',
    },
    {
      id: 'customers',
      disablePadding: true,
      label: 'New customers',
      tooltip: 'New customers attracted by the campaign',
    },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    slot: renderSimpleIconRow,
    start_end_date: renderSimpleIconRow,
    platform: renderPlatform,
    conversion_rate: renderPercent,
    status: renderStatus,
    revenue: renderCurrency,
    customers: renderSimpleIconRow,
    orders: renderSimpleIconRow,
    impressions: renderSimpleIconRow,
    clicks: renderSimpleIconRow,
    cost_per_click: renderCurrency,
    spend: renderCurrency,
    return_on_ad_spent: renderCurrency,
  };

  const renderRowsByHeader = (r) =>
    (link === 'ads_managment' ? headersManagment : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.ad_ids.join('') }, cur),
        id: r.master_ad_id,
        data: r,
      }),
      {}
    );

  const cellTemplatesObjectLoading = {
    chain_id: renderSimpleRowSkeleton,
    vendor_ids: renderPlatformSkeleton,
    slot: renderSimpleRowSkeleton,
    start_end_date: renderSimpleRowSkeleton,
    platform: renderPlatformSkeleton,
    conversion_rate: renderSimpleRowSkeleton,
    status: renderPercentSkeleton,
    revenue: renderSimpleRowSkeleton,
    customers: renderSimpleRowSkeleton,
    orders: renderSimpleRowSkeleton,
    impressions: renderSimpleRowSkeleton,
    clicks: renderSimpleRowSkeleton,
    spend: renderSimpleRowSkeleton,
    return_on_ad_spent: renderSimpleRowSkeleton,
    cost_per_click: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderLoading = (r) =>
    (link === 'ads_managment' ? headersManagment : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );

  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState([]);

  const [adsData, setAdsData] = useState([]);
  const [adsFilteredData, setAdsFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    platform: [],
    status: [],
    start_hour: [],
    end_hour: [],
  });
  const [filtersHead, setFiltersHead] = useState({
    platform: [],
    status: [],
    start_hour: [],
    end_hour: [],
  });

  useEffect(() => {
    setAdsData(ads);
    setRow(ads);
  }, [ads]);

  const renderStatusFilter = (s) => {
    if (!s) return null;

    return (
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
        {s}
      </span>
    );
  };

  useEffect(() => {
    const preHead = adsData.reduce(
      (acc, cur) => {
        const { platform, status } = acc;

        if (!platform.includes(cur.platform) && cur.platform) platform.push(cur.platform);

        if (!status.includes(cur.status.toLowerCase()) && cur.status)
          status.push(cur.status.toLowerCase());

        return {
          ...acc,
          platform,
          status,
        };
      },
      { platform: [], status: [] }
    );

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s.toLowerCase(),
      text: renderPlatformInsideFilter(s.toLowerCase()),
    }));

    const preHeadStatus = preHead.status.map((s) => ({
      value: s.toLowerCase(),
      text: renderStatusFilter(s),
    }));

    setFiltersHead({
      platform: preHeadPlatform,
      status: preHeadStatus,
      start_hour: [],
      end_hour: [],
    });
  }, [JSON.stringify(adsData)]);

  useEffect(() => {
    let filteredData = adsData;

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) => filters.platform.includes(f.platform));
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) => filters.status.includes(f.status.toLowerCase()));
    }
    setAdsFilteredData(
      filteredData.map((obj) => ({
        ...obj,
        start_end_date: `${dayjs(new Date(obj.valid_from)).format('DD/MM')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('DD/MM')}`,
        slot: `${dayjs(new Date(obj.valid_from)).format('HH:mm')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('HH:mm')}`,
        orders: obj.orders_count,
        clicks: obj.clicks_count,
        impressions: obj.ad_serving_count,
        customers: obj.new_customers_count,
        spend:
          obj.spend === null || obj.total_budget === null
            ? null
            : `${obj.spend}/${obj.total_budget}`,
      }))
    );
  }, [JSON.stringify(filters), adsData]);

  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );
  const CancelAd = () => {
    row.forEach((obj, index) => {
      selected.forEach((n) => {
        if (n === index) {
          row.splice(index, 1, { ...obj, status: 'canceled' });
          setRow([...row]);
          setSelected([]);
        }
      });
    });
    setOpened(false);
  };

  const CloseFilterPopup = (cancel = false) => {
    if (cancel) {
      setFilters(defaultFilterStateFormat);
    }

    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };

  const handleChangeMultipleFilter = (k) => (v) => {
    const propertyFilter = filters[k];

    const index = propertyFilter.findIndex((p) => p === v);

    if (index < 0) {
      setFilters({ ...filters, [k]: [...propertyFilter, v] });
      return;
    }

    const mutablePropertyFilter = [...propertyFilter];

    mutablePropertyFilter.splice(index, 1);

    setFilters({ ...filters, [k]: mutablePropertyFilter });
  };

  const isEmptyList = () => adsData.length < 1;

  const renderTable = () => {
    if (link === 'ads_performance') {
      return (
        <TableRevlyNew
          links={links}
          setLink={setLink}
          link={link}
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={isLoadingAds}
          headers={headersPerformance}
          rows={adsFilteredData.map(renderRowsByHeader)}
          mainFieldOrdered='start_date'
          setOpenedFilter={!isEmptyList() ? setOpenedFilter : null}
          filters={!isEmptyList() ? filters : null}
          filtersHead={!isEmptyList() ? filtersHead : null}
          handleChangeMultipleFilter={!isEmptyList() ? handleChangeMultipleFilter : null}
          noDataText='No ads has been retrieved.'
        />
      );
    }

    return (
      <TableRevlyNew
        links={links}
        setLink={setLink}
        link={link}
        renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
        isLoading={isLoadingAds}
        headers={headersManagment}
        rows={adsFilteredData.map(renderRowsByHeader)}
        mainFieldOrdered='start_date'
        setOpenedFilter={!isEmptyList() ? setOpenedFilter : null}
        filters={!isEmptyList() ? filters : null}
        filtersHead={!isEmptyList() ? filtersHead : null}
        handleChangeMultipleFilter={!isEmptyList() ? handleChangeMultipleFilter : null}
        noDataText='No ads has been retrieved.'
      />
    );
  };
  return (
    <div className='wrapper marketing-wrapper'>
      <div className='marketing-top'>
        <div className='marketing-top-text'>
          <TypographyKit variant='h4'>Marketing - Ads</TypographyKit>
          <TypographyKit color='#637381' variant='subtitle'>
            Create and manage all your offers. Set personalised rules to automatically trigger your
            Ads.
          </TypographyKit>
        </div>
        <div className='markting-top-btns'>
          <ButtonKit disabled className='sm-rule-btn disabled' variant='outlined'>
            <img src={SmartRuleBtnIcon} alt='Smart rule icon' />
            Create a smart rule
          </ButtonKit>
          <ButtonKit disabled variant='contained'>
            <img src={SettingFuture} alt='Setting future icon' />
            Set up an ad
          </ButtonKit>
        </div>
      </div>
      {renderTable()}
      <MarketingSetup ads active={active} setActive={setActive} />
      <div
        role='presentation'
        tabIndex={-1}
        onClick={() => setOpened(false)}
        className={`delete-overlay ${opened ? 'active' : ''}`}
      >
        <PaperKit onClick={(e) => e.stopPropagation()} className='marketing-paper'>
          <div>
            <img src={logo} alt='logo' />
            <TypographyKit>Are you sure you want to delete this offer ?</TypographyKit>
          </div>
          <TypographyKit>
            Amet, morbi egestas ultrices id non a. Est morbi consequat quis ac, duis elit, eleifend.
            Tellus diam mi phasellus facilisi id iaculis egestas.
          </TypographyKit>
          <div>
            <ButtonKit onClick={() => CancelAd()} variant='contained'>
              Cancel Offer
            </ButtonKit>
            <ButtonKit onClick={() => setOpened(false)} variant='outlined'>
              Cancel
            </ButtonKit>
          </div>
        </PaperKit>
      </div>
      <MarketingOfferFilter
        CloseFilterPopup={CloseFilterPopup}
        openedFilter={openedFilter}
        filtersHead={filtersHead}
        filters={filters}
        handleChangeMultipleFilter={handleChangeMultipleFilter}
      />
    </div>
  );
};

export default MarketingAds;
