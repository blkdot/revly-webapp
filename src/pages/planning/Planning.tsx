import { pascalCase } from 'change-case';
import Dates from 'components/dates/Dates';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { endOfMonth, endOfWeek } from 'date-fns';
import dayjs from 'dayjs';
import { useDate, usePlanningAds, usePlanningOffers, useQueryState } from 'hooks';

import { useEffect, useState } from 'react';

import { platformObject } from '../../data/platformList';
import OfferDetailComponent from '../offers/details';
import './Planning.scss';

const defaultFilterStateFormat = {
  platform: [],
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

  const { offers, isLoading: isLoadingOffers } = usePlanningOffers({ dateRange });
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange });
  const [filters, setFilters] = useState({
    ...defaultFilterStateFormat,
    ...JSON.parse(filtersSaved || '{}'),
  });
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
  const handleChangeMultipleFilter = (k: string) => (v: string) => {
    const propertyFilter = filters[k];

    const index = propertyFilter.findIndex((p: string) => p === v);

    if (index < 0) {
      setFilters({ ...filters, [k]: [...propertyFilter, v] });
      return;
    }

    const mutablePropertyFilter = [...propertyFilter];

    mutablePropertyFilter.splice(index, 1);

    setFilters({ ...filters, [k]: mutablePropertyFilter });
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
          filters={!isEmptyList() ? filters : null}
          filtersHead={filtersHead}
          handleChangeMultipleFilter={handleChangeMultipleFilter}
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
        filters={!isEmptyList() ? filters : null}
        filtersHead={filtersHead}
        handleChangeMultipleFilter={handleChangeMultipleFilter}
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

  const isEmptyList = () => {
    const source = link === 'ads_planning' ? ads : offers;

    return source.length < 1;
  };

  const renderStatusFilter = (s: string) => {
    if (!s) return null;

    return (
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
        {s}
      </span>
    );
  };

  const renderPlatformInsideFilter = (s: string) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );

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
      { type_offer: [], platform: [], discount_rate: [], status: [] }
    );

    const clonedFilters = { ...filters };

    clonedFilters.platform.forEach((fp, i) => {
      if (!preHead.platform.includes(fp)) clonedFilters.platform.splice(i, 1);
    });

    clonedFilters.type_offer.forEach((fp, i) => {
      if (!preHead.type_offer.includes(fp)) clonedFilters.type_offer.splice(i, 1);
    });

    clonedFilters.discount_rate.forEach((fp, i) => {
      if (!preHead.discount_rate.includes(fp)) clonedFilters.discount_rate.splice(i, 1);
    });

    clonedFilters.status.forEach((fp, i) => {
      if (!preHead.status.includes(fp)) clonedFilters.status.splice(i, 1);
    });

    setFilters(clonedFilters);

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

    setDataFiltered(
      filteredData.map((obj) => ({
        ...obj,
        start_end_date: `${dayjs(new Date(obj.valid_from)).format('DD/MM')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('DD/MM')}`,
        slot: `${dayjs(new Date(obj.valid_from)).format('HH:mm')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('HH:mm')}`,
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

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates offer beforePeriodBtn={dateRange} setbeforePeriodBtn={setDateRange} />
      </div>
      {opened ? (
        <OfferDetailComponent
          data={offers.find((o) => String(o.master_offer_id) === String(clickedId))}
          setOpened={setOpened}
        />
      ) : (
        renderTable()
      )}
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

export default Planning;
