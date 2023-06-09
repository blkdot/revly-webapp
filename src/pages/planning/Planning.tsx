import { usePlanningAds, usePlanningOffers } from 'api';
import { Switch } from 'assets/icons';
import { pascalCase } from 'change-case';
import { PageHeader } from 'components';
import Dates from 'components/dates/Dates';
import FilterBranch from 'components/filter/filterBranch/FilterBranch';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import HeaderDropdowns from 'components/header/HeaderDropdowns';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import LinkRevly from 'components/linkRevly/LinkRevly';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import Calendar from 'components/calendar/Calendar';
import { VendorsDropdownAdapter } from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { usePlatform } from 'contexts';
import { endOfMonth, endOfWeek } from 'date-fns';
import dayjs from 'dayjs';
import { useDate, useQueryState, useVendors } from 'hooks';
import { ContainerKit, TypographyKit, BoxKit, PaperKit } from 'kits';
import { useEffect, useMemo, useState } from 'react';
import { capitalize } from 'utils';
import Columns from '../../assets/images/columns.svg';
import { platformObject } from '../../data/platformList';
import OfferDetailComponent from '../offers/details';
import './Planning.scss';

const defaultFilterStateFormat = {
  platform: [],
  vendors: [],
  type_offer: [],
  discount_rate: [],
  status: [],
  start_hour: [],
  end_hour: [],
};

type TAds = {
  ad_ids: string[];
  ad_serving_count: number;
  area: string | null;
  attributed_order_value: number | null;
  canceled_at: string | null;
  chain_id: number;
  chain_name: string;
  clicks_count: number;
  conversion_rate: number;
  cost_per_click: number;
  created_at: string | Date;
  master_ad_id: string;
  new_customers_count: number;
  orders_count: number;
  platform: string;
  return_on_ad_spent: number;
  source: string;
  spend: number | null;
  status: string;
  total_budget: number | null;
  valid_from: string | Date;
  valid_to: string | Date;
  vendor_ids: number[];
  _metadata: null;
};

const Planning = () => {
  const [dateSaved, setDateSaved] = useQueryState('date');
  const [filtersSaved, setFiltersSaved] = useQueryState('filters');
  const filtersParamsObject = JSON.parse(filtersSaved || '{}');

  const { date } = useDate();
  const getOfferDate = () => {
    if (date.typeDate === 'month') {
      return endOfMonth(new Date(date.beforePeriod.endDate));
    }
    if (date.typeDate === 'week') {
      return endOfWeek(new Date(date.beforePeriod.endDate), { weekStartsOn: 1 });
    }
    return date.beforePeriod.endDate;
  };

  const [dateRange, setDateRange] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: getOfferDate(),
    ...JSON.parse(dateSaved || '{}'),
  });

  const { data: adsData, isLoading: isLoadingAds } = usePlanningAds({
    from: dayjs(dateRange.startDate),
    until: dayjs(dateRange.endDate),
  });
  const { data: offersData, isLoading: isLoadingOffers } = usePlanningOffers({
    from: dayjs(dateRange.startDate),
    until: dayjs(dateRange.endDate),
  });

  const ads = useMemo(() => adsData?.ads || [], [adsData]);
  const offers = useMemo(() => offersData?.offers || [], [offersData]);

  const [filters, setFilters] = useState({ ...defaultFilterStateFormat, ...filtersParamsObject });
  const { userPlatformData } = usePlatform();
  const renderPlatformInsideFilter = (s: string) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );

  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [dataFilteredAds, setDataFilteredAds] = useState([]);
  const [openedFilter, setOpenedFilter] = useState(false);

  useEffect(() => {
    setDateSaved(dateRange);
    setFiltersSaved(filters);
  }, [JSON.stringify(filters), JSON.stringify(dateRange)]);

  const {
    renderPlatform,
    renderPercent,
    renderCurrency,
    renderStatus,
    renderChainId,
    renderSimpleRow,
    renderVendorId,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderSimpleIconRow,
    renderPercentSkeleton,
  } = useTableContentFormatter();

  const headersOffers = [
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
    { id: 'type_offer', disablePadding: true, label: 'Discount type' },
    { id: 'discount_rate', disablePadding: true, label: 'Discount rate' },
    { id: 'goal', disablePadding: true, label: 'Target' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const headersAds = [
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
    { id: 'total_budget', disablePadding: true, label: 'Budget', tooltip: 'Ads campaign budget' },
    {
      id: 'cost_per_click',
      disablePadding: true,
      label: 'Cost Per Click',
      tooltip:
        'Commonly referred to as CPC. You can either set the CPC manually or let the aggregator set a dynamic CPC, only available on Deliveroo.',
    },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    slot: renderSimpleIconRow,
    start_end_date: renderSimpleIconRow,
    platform: renderPlatform,
    type_offer: renderSimpleRow,
    discount_rate: renderPercent,
    goal: renderSimpleIconRow,
    status: renderStatus,
    total_budget: renderCurrency,
    cost_per_click: renderCurrency,
  };

  const renderRowsByHeaderOffer = (r) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_ids.join('') }, cur),
        id: r.master_offer_id,
        data: r,
      }),
      {}
    );

  const renderRowsByHeaderAds = (r: TAds) =>
    headersAds.reduce(
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
    start_end_date: renderSimpleRowSkeleton,
    slot: renderSimpleRowSkeleton,
    platform: renderPlatformSkeleton,
    type_offer: renderSimpleRowSkeleton,
    discount_rate: renderPercentSkeleton,
    goal: renderSimpleRowSkeleton,
    status: renderPercentSkeleton,
    total_budget: renderSimpleRowSkeleton,
    cost_per_click: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderOfferLoading = (r) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );

  const renderRowsByHeaderAdsLoading = (r) =>
    headersAds.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const [opened, setOpened] = useState(false);
  const [clickedId, setClickedId] = useState('');

  const handleRowClick = (id: string) => {
    setOpened(true);
    setClickedId(id);
  };
  const [link, setLink] = useState('offers_planning');
  const links = [
    { title: 'Offers planning', link: 'offers_planning' },
    { title: 'Ads planning', link: 'ads_planning' },
  ];
  const handleChangeFilter = (k: string, type?: string) => (v: string) => {
    const propertyFilter = filters[k];

    const index = propertyFilter.findIndex((p: string) => p === v);

    if (index < 0) {
      setFilters({ ...filters, [k]: type === 'single' ? [v] : [...propertyFilter, v] });
      return;
    }

    const mutablePropertyFilter = [...propertyFilter];

    mutablePropertyFilter.splice(index, 1);

    setFilters({ ...filters, [k]: mutablePropertyFilter });
  };

  const { vendors } = useVendors();
  const { chainData } = vendors;
  const renderOffersFilters = () => (
    <div className='table-filters'>
      <FilterDropdown
        items={filtersHead.platform}
        values={filters.platform}
        onChange={handleChangeFilter('platform', 'single')}
        label='Platforms'
        icon={<img src={Columns} alt='Clock' />}
        internalIconOnActive={platformObject}
        maxShowned={1}
        mono
      />
      <FilterBranch
        items={chainData.filter(
          (chainD) => chainD.platform === filters.platform[0] && chainD.is_active
        )}
        values={filters.vendors}
        onChange={handleChangeFilter('vendors')}
        icon={<img src={Columns} alt='Platform' />}
        label='Show all branches'
        multi
      />
      <FilterDropdown
        items={filtersHead.status}
        values={filters.status}
        onChange={handleChangeFilter('status')}
        label='Statuses'
        icon={<Switch />}
        maxShowned={1}
      />
    </div>
  );
  const renderAdsFilters = () => (
    <div className='table-filters'>
      <FilterDropdown
        items={filtersHead.platform}
        values={filters.platform}
        onChange={handleChangeFilter('platform', 'single')}
        label='Platforms'
        icon={<img src={Columns} alt='Clock' />}
        internalIconOnActive={platformObject}
        maxShowned={1}
        mono
      />
      <FilterBranch
        items={chainData.filter(
          (chainD) => chainD.platform === filters.platform[0] && chainD.is_active
        )}
        values={filters.vendors}
        onChange={handleChangeFilter('vendors')}
        icon={<img src={Columns} alt='Platform' />}
        label='Show all branches'
        multi
      />
      <FilterDropdown
        items={filtersHead.status}
        values={filters.status}
        onChange={handleChangeFilter('status')}
        label='Statuses'
        icon={<Switch />}
        maxShowned={1}
      />
    </div>
  );

  const isEmptyList = () => {
    const source = link === 'ads_planning' ? ads : offers;

    return source.length < 1;
  };

  const renderFilter = () => {
    if (link === 'ads_planning') {
      return !isEmptyList() && renderAdsFilters();
    }
    
    return !isEmptyList() && renderOffersFilters();
  };

  const renderTable = () => {
    if (link === 'ads_planning') {
      return (
        <TableRevlyNew
          links={links}
          setLink={setLink}
          link={link}
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderAdsLoading)}
          isLoading={isLoadingAds}
          headers={headersAds}
          rows={dataFilteredAds.map(renderRowsByHeaderAds)}
          mainFieldOrdered='start_date'
          setOpenedFilter={setOpenedFilter}
          filters={!isEmptyList() && renderAdsFilters()}
          noDataText='No ads has been retrieved.'
        />
      );
    }

    return (
      <TableRevlyNew
        links={links}
        setLink={setLink}
        link={link}
        renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderOfferLoading)}
        isLoading={isLoadingOffers}
        headers={headersOffers}
        rows={dataFiltered.map(renderRowsByHeaderOffer)}
        mainFieldOrdered='start_date'
        onClickRow={handleRowClick}
        setOpenedFilter={setOpenedFilter}
        filters={!isEmptyList() && renderOffersFilters()}
        noDataText='No offer has been retrieved.'
      />
    );
  };

  const CloseFilterPopup = (cancel = false) => {
    if (cancel) {
      setFilters(JSON.parse(filtersSaved));
    }

    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };

  const renderStatusFilter = (s: string) => {
    if (!s) return null;

    return (
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
        {s}
      </span>
    );
  };
  
  const [viewType, setViewType] = useState('table');

  useEffect(() => {
    const source = link === 'ads_planning' ? ads : offers;
    const preHead = source.reduce(
      (acc, cur) => {
        const { platform, type_offer: discountType, discount_rate: procent, status } = acc;

        if (!platform.includes(cur.platform.toLowerCase()) && cur.platform)
          platform.push(cur.platform.toLowerCase());

        if (!discountType.includes(cur.type_offer) && cur.type_offer)
          discountType.push(cur.type_offer);

        if (!procent.includes(cur.discount_rate) && cur.discount_rate)
          procent.push(cur.discount_rate);

        if (!status.includes(cur.status.toLowerCase())) status.push(cur.status.toLowerCase());

        return { ...acc, platform, type_offer: discountType, discount_rate: procent, status };
      },
      { type_offer: [], platform: [], discount_rate: [], status: [], ...filtersParamsObject }
    );

    const clonedFilters = { ...filtersParamsObject, ...filters };

    clonedFilters.platform.forEach((fp, i) => {
      if (!preHead.platform.includes(fp)) clonedFilters.platform.splice(i, 1);
    });

    const defaultPlatform = Object.keys(userPlatformData.platforms).find((plat) =>
      userPlatformData.platforms[plat].some((obj) => obj.active)
    );

    if (!filtersSaved) {
      if (clonedFilters.platform.length < 1 && defaultPlatform) {
        clonedFilters.platform.push(defaultPlatform);
      }
    }

    clonedFilters.type_offer.forEach((fp, i) => {
      if (!preHead.type_offer.includes(fp)) clonedFilters.type_offer.splice(i, 1);
    });

    clonedFilters.discount_rate.forEach((fp, i) => {
      if (!preHead.discount_rate.includes(fp)) clonedFilters.discount_rate.splice(i, 1);
    });

    clonedFilters.status.forEach((fp, i) => {
      if (!preHead.status.includes(fp)) clonedFilters.status.splice(i, 1);
    });

    setFilters({
      ...clonedFilters,
      ...JSON.parse(filtersSaved || '{}'),
    });

    const preHeadPlatform = preHead.platform.map((s: string) => ({
      value: s.toLowerCase(),
      text: renderPlatformInsideFilter(s.toLowerCase()),
    }));

    const preHeadTypeOffer = preHead.type_offer.map((s: string) => ({ value: s, text: s }));
    const preHeadProcent = preHead.discount_rate.map((s: string) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s: string) => ({
      value: s.toLowerCase(),
      text: renderStatusFilter(s),
    }));

    setFiltersHead({
      platform: preHeadPlatform,
      vendors: chainData.filter(
        (chainD) => chainD.platform === filters.platform[0] && chainD.is_active
      ),
      type_offer: link === 'ads_planning' ? [] : preHeadTypeOffer,
      discount_rate: link === 'ads_planning' ? [] : preHeadProcent,
      status: preHeadStatus,
      start_hour: [],
      end_hour: [],
    });
  }, [ads, offers, link, JSON.stringify(dateRange)]);

  useEffect(() => {
    let filteredData = offers;
    let filteredDataAds = ads;
    
    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) => filters.platform.includes(f.platform));
      filteredDataAds = filteredDataAds.filter((f) => filters.platform.includes(f.platform));
    }

    if (filters.type_offer.length > 0) {
      filteredData = filteredData.filter((f) => filters.type_offer.includes(f.type_offer));
      filteredDataAds = filteredDataAds.filter((f) => filters.type_offer.includes(f.type_offer));
    }

    if (filters.discount_rate.length > 0) {
      filteredData = filteredData.filter((f) => filters.discount_rate.includes(f.discount_rate));
      filteredDataAds = filteredDataAds.filter((f) =>
        filters.discount_rate.includes(f.discount_rate)
      );
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) => filters.status.includes(f.status.toLowerCase()));
      filteredDataAds = filteredDataAds.filter((f) =>
        filters.status.includes(f.status.toLowerCase())
      );
    }

    if (filters.vendors.length > 0) {
      filteredData = filteredData.filter((f) =>
        f.vendor_ids.some((vId) => filters.vendors.includes(vId))
      );
      filteredDataAds = filteredDataAds.filter((f) =>
        f.vendor_ids.some((vId) => filters.vendors.includes(vId))
      );
    }

    setDataFiltered(
      filteredData.map((obj) => ({
        ...obj,
        start_end_date: `${dayjs(new Date(obj.valid_from)).format('DD/MM')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('DD/MM')}`,
        slot: `${obj.start_hour} - ${obj.end_hour}`,
      }))
    );
    setDataFilteredAds(
      filteredDataAds.map((obj) => ({
        ...obj,
        start_end_date: `${dayjs(new Date(obj.valid_from)).format('DD/MM')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('DD/MM')}`,
        slot: `${dayjs(new Date(obj.valid_from)).format('HH:mm')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('HH:mm')}`,
      }))
    );
  }, [JSON.stringify(filters), ads, offers, link, JSON.stringify(dateRange)]);

  const [period, setPeriod] = useState('');

  const title = `Planning for ${
    link === 'offers_planning' ? 'discounts' : 'ads'
  } scheduled for ${capitalize(period)}`;

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <VendorsDropdownAdapter />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Dates
            setPeriodProps={setPeriod}
            offer
            beforePeriodBtn={dateRange}
            setbeforePeriodBtn={setDateRange}
          />
          <HeaderDropdowns />
        </div>
      </div>
      <ContainerKit>
        {opened ? (
          <OfferDetailComponent
            data={offers.find((o) => String(o.master_offer_id) === String(clickedId))}
            setOpened={setOpened}
          />
        ) : (
          <div className='block'>
            <TypographyKit className='dashboard-title'>
              Planning for {link === 'offers_planning' ? 'discounts' : 'ads'} scheduled for{' '}
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </TypographyKit>
            <TypographyKit className='dashboard-subtitle'>
              Plan and visualize all the scheduled and past discounts and campaigns.
            </TypographyKit>
            <LinkRevly
              viewType={viewType}
              setViewType={setViewType}
              links={links}
              setLink={setLink}
              link={link}
              filters={renderFilter()}
              setOpenedFilter={setOpenedFilter}
            />
            {viewType === 'table' && renderTable()}
            {viewType === 'calendar' && (
              <Calendar
                dateRange={dateRange}
                events={dataFiltered}
              />
            )}
          </div>
        )}
        <MarketingOfferFilter
          CloseFilterPopup={CloseFilterPopup}
          openedFilter={openedFilter}
          filtersHead={filtersHead}
          filters={filters}
          handleChangeMultipleFilter={handleChangeFilter}
        />
      </ContainerKit>
    </div>
  );
};

export default Planning;
