import { usePlanningAds } from 'api';
import { Switch } from 'assets/icons';
import arrow from 'assets/images/arrow.svg';
import { pascalCase } from 'change-case';
import AdvertsCreateNewCampaign from 'components/createNewCampaign/AdvertsCreateNewCampaign';
import Dates from 'components/dates/Dates';
import AdvertsDetails from 'components/details/AdvertsDetails';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { usePlatform } from 'contexts';
import { platformObject } from 'data/platformList';
import { endOfMonth, endOfWeek } from 'date-fns';
import dayjs from 'dayjs';
import { useDate, useMarketingSetup, useQueryState, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonAction, ButtonKit, ContainerKit } from 'kits';
import { defaultFilterStateFormat } from 'pages/marketing/marketingOfferData';
import { useEffect, useMemo, useState } from 'react';
import { branchAtom } from 'store/marketingSetupAtom';
import Columns from '../../assets/images/columns.svg';
import './Adverts.scss';

const Adverts = () => {
  const { date } = useDate();
  const { beforePeriod } = date;
  const { vendors } = useVendors();
  const [disabled, setDisabled] = useState(true);
  const [branchVendors, setBranchVendors] = useAtom(branchAtom);
  const AvailablePlatform = ['deliveroo'];
  const { setVendors } = useMarketingSetup();
  const [openedCampaign, setOpenedCampaign] = useState(false);
  const { userPlatformData } = usePlatform();
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    setVendors(displayTemp, setBranchVendors, branchVendors, AvailablePlatform);

    if (
      selectedVendors('name', displayTemp).length > 0 &&
      AvailablePlatform.some((plat) => userPlatformData.platforms[plat].some((obj) => obj.active))
    ) {
      setTimeout(() => {
        setDisabled(false);
      }, 1500);
    } else {
      setDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors, openedCampaign]);

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

  const [link, setLink] = useState('ads_management');
  const startDate = new Date(beforePeriodBtn.startDate);
  const endDate = new Date(beforePeriodBtn.endDate);

  const { data, isLoading: isLoadingAds } = usePlanningAds({
    from: dayjs(startDate),
    until: dayjs(endDate),
  });

  const ads = useMemo(() => data?.ads || [], [data]);

  const [adsData, setAdsData] = useState([]);
  useEffect(() => {
    const newArr = ads.map((obj) => ({
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
    (link === 'ads_management' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.master_ad_id }, cur),
        id: `${r.ad_ids.join('')}_ads`,
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
    (link === 'ads_management' ? headersList : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const [opened, setOpened] = useState(false);
  const [clickedRow, setClickedRow] = useState({});
  const [openedFilter, setOpenedFilter] = useState(false);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [filtersSaved, setFiltersSaved] = useQueryState('filters') as any;
  const [filters, setFilters] = useState({
    ...defaultFilterStateFormat,
    ...JSON.parse((filtersSaved || '{}') as any),
  });
  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);
  useEffect(() => {
    setFiltersSaved(filters);
  }, [JSON.stringify(filters)]);
  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );
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

        if (!platform.includes(cur.platform.toLowerCase()) && cur.platform)
          platform.push(cur.platform.toLowerCase());

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

    const clonedFilters = { ...filters };

    clonedFilters.platform.forEach((fp, i) => {
      if (!preHead.platform.includes(fp)) clonedFilters.platform.splice(i, 1);
    });

    clonedFilters.status.forEach((fp, i) => {
      if (!preHead.status.includes(fp)) clonedFilters.status.splice(i, 1);
    });

    setFilters(clonedFilters);

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
      type_offer: [],
      discount_rate: [],
      status: preHeadStatus,
      goal: [],
      start_hour: [],
      end_hour: [],
    });
  }, [JSON.stringify(adsData)]);
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
  const CloseFilterPopup = (cancel = false) => {
    if (cancel) {
      setFilters(defaultFilterStateFormat);
    }

    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };

  const isEmptyList = () => adsData.length < 1;
  useEffect(() => {
    let filteredData = adsData;

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) =>
        filters.platform.includes(f.platform.toLowerCase())
      );
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) => filters.status.includes(f.status.toLowerCase()));
    }

    setDataFiltered(filteredData);
  }, [JSON.stringify(filters), adsData]);
  const renderFilters = () => (
    <div className='table-filters'>
      <FilterDropdown
        items={filtersHead.platform}
        values={filters.platform}
        onChange={handleChangeMultipleFilter('platform')}
        label='Platforms'
        icon={<img src={Columns} alt='Clock' />}
        internalIconOnActive={platformObject}
        maxShowned={1}
      />
      <FilterDropdown
        items={filtersHead.status}
        values={filters.status}
        onChange={handleChangeMultipleFilter('status')}
        label='Statuses'
        icon={<Switch />}
        maxShowned={1}
      />
    </div>
  );
  const links = [
    { title: 'Ads management', link: 'ads_management' },
    { title: 'Ads performance', link: 'ads_performance' },
  ];
  const renderLayout = () => {
    if (openedCampaign) {
      return <AdvertsCreateNewCampaign setOpened={setOpenedCampaign} />;
    }
    if (opened) {
      return (
        <ContainerKit>
          <AdvertsDetails data={clickedRow} setOpened={setOpened} />
        </ContainerKit>
      );
    }
    return (
      <ContainerKit>
        <div>
          <div className='adverts_top-titles'>
            <div>
              <div className='dashboard-title'>Marketing - Ads</div>
              <div className='dashboard-subtitle'>
                Create and manage all your ads. Set personalised rules to automatically trigger your
                ads.
              </div>
            </div>
            <ButtonAction className='adverts-btn' disabled={disabled} onClick={() => !disabled && setOpenedCampaign(true)}>
              Create new campaign
            </ButtonAction>
          </div>
          <TableRevlyNew
            onClickRow={(id) => {
              setClickedRow(adsData.find((obj) => `${obj.ad_ids.join('')}_ads` === id));
              setOpened(true);
            }}
            link={link}
            setLink={setLink}
            links={links}
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderListLoading)}
            isLoading={isLoadingAds}
            headers={link === 'ads_management' ? headersList : headersPerformance}
            rows={dataFiltered.map(renderRowsByHeaderList)}
            noDataText='No ads has been retrieved.'
            filters={!isEmptyList() && renderFilters()}
            setOpenedFilter={setOpenedFilter}
          />
        </div>
        <MarketingOfferFilter
          CloseFilterPopup={CloseFilterPopup}
          openedFilter={openedFilter}
          filtersHead={filtersHead}
          filters={filters}
          handleChangeMultipleFilter={handleChangeMultipleFilter}
        />
      </ContainerKit>
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
