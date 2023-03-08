/* eslint-disable no-unused-vars */
import { usePlanningOffers } from 'api';
import { Switch } from 'assets/icons';
import { pascalCase } from 'change-case';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import MarketingOfferRemove from 'components/marketingOfferRemove/MarketingOfferRemove';
import MarketingSetup from 'components/marketingSetup/MarketingSetup';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useDates } from 'contexts';
import { endOfMonth, endOfWeek } from 'date-fns';
import dayjs from 'dayjs';
import { useQueryState } from 'hooks';
import { ButtonAction, ContainerKit } from 'kits';
import DescriptionTitle from 'kits/title/DescriptionTitle';
import MainTitle from 'kits/title/MainTitle';
import { useEffect, useState } from 'react';
import { DatePeriod } from 'types';
import Columns from '../../assets/images/columns.svg';
import { platformObject } from '../../data/platformList';
import OfferDetailComponent from '../offers/details';
import './Marketing.scss';
import { defaultFilterStateFormat } from './marketingOfferData';

const getOfferDate = (period: DatePeriod, type: string): Date => {
  if (type === 'month') {
    return endOfMonth(new Date(period.until.toDate()));
  }
  if (type === 'week') {
    return endOfWeek(new Date(period.until.toDate()), { weekStartsOn: 1 });
  }

  return period.until.toDate();
};

const MarketingOffer = () => {
  const { current, calendar } = useDates();
  const [active, setActive] = useState(false);

  const { data, isLoading: isLoadingOffers } = usePlanningOffers({
    from: current.from,
    until: dayjs(getOfferDate(current, calendar)),
  });

  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(data?.offers || []);
  const [offersData, setOffersData] = useState(data?.offers || []);
  const [offersDataFiltered, setOffersDataFiltered] = useState([]);

  const [filtersSaved, setFiltersSaved] = useQueryState('filters') as any;
  const [filters, setFilters] = useState({
    ...defaultFilterStateFormat,
    ...JSON.parse((filtersSaved || '{}') as any),
  });

  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);

  useEffect(() => {
    setFiltersSaved(filters);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    setOffersData(data?.offers || []);
    setRow(data?.offers || []);
  }, [data]);

  const {
    renderPlatform,
    renderPercent,
    renderStatus,
    renderChainId,
    renderSimpleRow,
    renderVendorId,
    renderSimpleRowSkeleton,
    renderPlatformSkeleton,
    renderSimpleIconRow,
    renderPercentSkeleton,
    renderCurrency,
  } = useTableContentFormatter();

  const [link, setLink] = useState('offers_managment');
  const links = [
    { title: 'Offers management', link: 'offers_managment' },
    { title: 'Offers performance', link: 'offers_performance' },
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
    { id: 'type_offer', disablePadding: true, label: 'Discount type' },
    { id: 'discount_rate', disablePadding: true, label: 'Discount rate' },
    { id: 'goal', disablePadding: true, label: 'Target' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];
  const headersPerformance = [
    { id: 'chain_id', disablePadding: true, label: 'Chain Name', tooltip: 'Your brand name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Branches' },
    {
      id: 'slot',
      disablePadding: true,
      label: 'Slot',
      tooltip: 'Daily start and end hour of your offer, and the # of hours it is running daily.',
    },
    {
      id: 'revenue',
      disablePadding: true,
      label: 'Revenue',
      tooltip: 'Revenue generated by the offer',
    },
    {
      id: 'accrued_discount',
      disablePadding: true,
      label: 'Discounts',
      tooltip: 'Total amount of discounts given for this offer',
    },
    {
      id: 'profit',
      disablePadding: true,
      label: 'Profits',
      tooltip:
        'Revenue generated by the offer minus aggregator$apos;s commission, discounts amount, ads CPC and food cost.',
    },
    {
      id: 'orders',
      disablePadding: true,
      label: 'Orders',
      tooltip: '# of orders generated by the offer',
    },
    {
      id: 'roi',
      disablePadding: true,
      label: 'ROI',
      tooltip: `# AED generated in Profits for every 1 AED spent on discount. Profits are revenue minus aggregator's commission, order discount, ads CPC and food cost.`,
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
    revenue: renderCurrency,
    profit: renderCurrency,
    orders: renderSimpleIconRow,
    accrued_discount: renderCurrency,
    roi: renderCurrency,
  };

  const renderRowsByHeader = (r) =>
    (link === 'offers_managment' ? headersManagment : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_ids.join('') }, cur),
        id: r.master_offer_id,
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
    revenue: renderSimpleRowSkeleton,
    profit: renderSimpleRowSkeleton,
    orders: renderSimpleRowSkeleton,
    accrued_discount: renderSimpleRowSkeleton,
    roi: renderSimpleRowSkeleton,
  };

  const renderRowsByHeaderLoading = (r) =>
    (link === 'offers_managment' ? headersManagment : headersPerformance).reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoading[cur.id](cur),
        id: r,
      }),
      {}
    );
  const renderStatusFilter = (s) => {
    if (!s) return null;

    return (
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
        {s}
      </span>
    );
  };

  const targetMapping = {
    orders: 'Everyone',
    new_customers: 'New customers only',
    subscribers: 'Deliveroo Plus',
  };

  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );

  useEffect(() => {
    const preHead = offersData.reduce(
      (acc, cur) => {
        const { platform, type_offer: typeOffer, discount_rate: procent, status, goal } = acc;

        if (!platform.includes(cur.platform.toLowerCase()) && cur.platform)
          platform.push(cur.platform.toLowerCase());

        if (!typeOffer.includes(cur.type_offer) && cur.type_offer) typeOffer.push(cur.type_offer);

        if (!procent.includes(cur.discount_rate) && cur.discount_rate)
          procent.push(cur.discount_rate);

        if (!status.includes(cur.status.toLowerCase()) && cur.status)
          status.push(cur.status.toLowerCase());

        if (!goal.includes(cur.goal) && !goal.includes(targetMapping[cur.goal]) && cur.goal)
          goal.push(targetMapping[cur.goal] || cur.goal);

        return {
          ...acc,
          platform,
          type_offer: typeOffer,
          discount_rate: procent,
          status,
          goal,
        };
      },
      { type_offer: [], platform: [], discount_rate: [], status: [], goal: [] }
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

    clonedFilters.goal.forEach((fp, i) => {
      if (!preHead.goal.includes(fp)) clonedFilters.goal.splice(i, 1);
    });

    setFilters(clonedFilters);

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s.toLowerCase(),
      text: renderPlatformInsideFilter(s.toLowerCase()),
    }));

    const preHeadtypeOffer = preHead.type_offer.map((s) => ({ value: s, text: s }));
    const preHeadTarget = preHead.goal.map((s) => ({ value: s, text: s }));
    const preHeadProcent = preHead.discount_rate.map((s) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s) => ({
      value: s.toLowerCase(),
      text: renderStatusFilter(s),
    }));

    setFiltersHead({
      platform: preHeadPlatform,
      type_offer: preHeadtypeOffer,
      discount_rate: preHeadProcent,
      status: preHeadStatus,
      goal: preHeadTarget,
      start_hour: [],
      end_hour: [],
    });
  }, [JSON.stringify(offersData)]);

  const CancelOffer = () => {
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

  useEffect(() => {
    let filteredData = offersData;

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) =>
        filters.platform.includes(f.platform.toLowerCase())
      );
    }

    if (filters.type_offer.length > 0) {
      filteredData = filteredData.filter((f) => filters.type_offer.includes(f.type_offer));
    }

    if (filters.discount_rate.length > 0) {
      filteredData = filteredData.filter((f) => filters.discount_rate.includes(f.discount_rate));
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) => filters.status.includes(f.status.toLowerCase()));
    }

    if (filters.goal.length > 0) {
      filteredData = filteredData.filter((f) => filters.goal.includes(f.goal));
    }

    setOffersDataFiltered(
      filteredData.map((obj) => ({
        ...obj,
        start_end_date: `${dayjs(new Date(obj.valid_from)).format('DD/MM')} - ${dayjs(
          new Date(obj.valid_to)
        ).format('DD/MM')}`,
        slot: `${obj.start_hour} - ${obj.end_hour}`,
        orders: obj.n_orders,
      }))
    );
  }, [JSON.stringify(filters), offersData]);

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

  const OpenSetup = () => {
    const body = document.querySelector('body');
    setActive(true);
    body.style.overflowY = 'hidden';
  };

  const [openedOffer, setOpenedOffer] = useState(false);
  const [clickedId, setClickedId] = useState('');
  const handleRowClick = (id) => {
    setOpenedOffer(true);
    setClickedId(id);
  };
  const isEmptyList = () => offersData.length < 1;
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
  const renderTable = () => {
    if (link === 'offers_performance') {
      return (
        <TableRevlyNew
          links={links}
          setLink={setLink}
          link={link}
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={isLoadingOffers}
          headers={headersPerformance}
          rows={offersDataFiltered.map(renderRowsByHeader)}
          mainFieldOrdered='start_date'
          setOpenedFilter={setOpenedFilter}
          filters={!isEmptyList() && renderFilters()}
          noDataText='No offer has been retrieved.'
          onClickRow={handleRowClick}
        />
      );
    }

    return (
      <TableRevlyNew
        links={links}
        setLink={setLink}
        link={link}
        renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
        isLoading={isLoadingOffers}
        headers={headersManagment}
        rows={offersDataFiltered.map(renderRowsByHeader)}
        mainFieldOrdered='start_date'
        onClickRow={handleRowClick}
        setOpenedFilter={setOpenedFilter}
        filters={!isEmptyList() && renderFilters()}
        noDataText='No offer has been retrieved.'
      />
    );
  };
  return (
    <div className='wrapper marketing-wrapper'>
      <ContainerKit>
        <div className='marketing-top'>
          <div className='marketing-top-text'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <MainTitle>Marketing - Offers</MainTitle>
                <DescriptionTitle>
                  Create and manage all your offers. Set personalised rules to automatically trigger
                  your offers
                </DescriptionTitle>
              </div>
            </div>
          </div>
          <ButtonAction onClick={() => OpenSetup()}>Set up an offer</ButtonAction>
        </div>
        {openedOffer ? (
          <OfferDetailComponent
            // eslint-disable-next-line eqeqeq
            data={data?.offers.find((o) => o.master_offer_id == clickedId)}
            setOpened={setOpenedOffer}
          />
        ) : (
          renderTable()
        )}
        <MarketingSetup active={active} setActive={setActive} />
        <MarketingOfferRemove setOpened={setOpened} opened={opened} CancelOffer={CancelOffer} />
        <MarketingOfferFilter
          CloseFilterPopup={CloseFilterPopup}
          openedFilter={openedFilter}
          filtersHead={filtersHead}
          filters={filters}
          handleChangeMultipleFilter={handleChangeMultipleFilter}
        />
      </ContainerKit>
    </div>
  );
};

export default MarketingOffer;
