import { Layers, Tag, Vector } from 'assets/icons';
import { pascalCase } from 'change-case';
import Dates from 'components/dates/Dates';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from 'components/tableRevly/TableRevly';
import { endOfMonth, endOfWeek } from 'date-fns/esm';
import { useDate, usePlanningAds, usePlanningOffers, useQueryState } from 'hooks';
import { useAtom } from 'jotai';
import { BoxKit, ButtonKit, PaperKit, TypographyKit } from 'kits';
import { useEffect, useState } from 'react';
import shortid from 'shortid';
import adsIcon from '../../assets/images/ic_ads.png';
import offerIcon from '../../assets/images/ic_offers.png';
import { platformObject } from '../../data/platformList';
import { vendorsAtom } from '../../store/vendorsAtom';
import OfferDetailComponent from '../offers/details';
import './Planning.scss';

const defaultFilterStateFormat = {
  platform: [],
  type_offer: [],
  discount_rate: [],
  status: [],
};

const Planning = () => {
  const [dateSaved, setDateSaved] = useQueryState('date') as any;
  const [filtersSaved, setFiltersSaved] = useQueryState('filters') as any;
  const [active, setActive] = useState(0);
  const { date } = useDate();
  const [vendors] = useAtom(vendorsAtom);
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
    ...JSON.parse((dateSaved || '{}') as any),
  });
  const { vendorsArr, vendorsSelected, vendorsObj, display, chainObj } = vendors;
  const { offers, isLoading: isLoadingOffers } = usePlanningOffers({ dateRange });
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange });
  const [filters, setFilters] = useState({
    ...defaultFilterStateFormat,
    ...JSON.parse((filtersSaved || '{}') as any),
  });
  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);
  const [dataFiltered, setDataFiltered] = useState([]);
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
    renderSimpleRowNotCentered,
    renderTarget,
    renderScheduleType,
    renderSimpleRow,
    renderVendorId,
    renderTimeSlot,
    renderIsoDate,
  } = useTableContentFormatter();

  const headersOffers = [
    { id: 'chain_name', disablePadding: true, label: 'Chain name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Vendors' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'start_date', disablePadding: true, label: 'Start date' },
    { id: 'end_date', disablePadding: true, label: 'End date' },
    { id: 'type_schedule', disablePadding: true, label: 'Schedule type' },
    { id: 'start_hour', disablePadding: true, label: 'Slot Schedule' },
    { id: 'type_offer', disablePadding: true, label: 'Discount type' },
    { id: 'discount_rate', disablePadding: true, label: 'Discount rate' },
    { id: 'minimum_order_value', disablePadding: true, label: 'Minimum order value' },
    { id: 'goal', disablePadding: true, label: 'Target' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const headersAds = [
    { id: 'chain_name', disablePadding: true, label: 'Chain name' },
    { id: 'vendor_ids', disablePadding: true, label: 'Vendors' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'valid_from', disablePadding: true, label: 'Start date' },
    { id: 'valid_to', disablePadding: true, label: 'End date' },
    { id: 'total_budget', disablePadding: true, label: 'Budget' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    chain_name: renderSimpleRowNotCentered,
    platform: renderPlatform,
    vendor_ids: renderVendorId,
    start_date: renderSimpleRow,
    end_date: renderSimpleRow,
    valid_from: renderIsoDate,
    valid_to: renderIsoDate,
    type_schedule: renderScheduleType,
    start_hour: renderTimeSlot,
    type_offer: renderSimpleRow,
    discount_rate: renderPercent,
    minimum_order_value: renderCurrency,
    goal: renderTarget,
    status: renderStatus,
    total_budget: renderCurrency,
  };

  const renderRowsByHeaderOffer = (r) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_id }, cur),
        id: `${cur.id}_${r.start_date}_${r.end_date}_offers_${shortid.generate()}`,
        data: r,
      }),
      {}
    );

  const renderRowsByHeaderAds = (r) =>
    headersAds.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_id }, cur),
        id: `${cur.id}_${r.ad_id}_ads_${shortid.generate()}`,
        data: r,
      }),
      {}
    );
  const [opened, setOpened] = useState(false);
  const [clickedId, setClickedId] = useState('');
  const handleRowClick = (id) => {
    setOpened(true);
    setClickedId(id);
  };

  const renderTable = () => {
    if (active) {
      return (
        <TableRevly
          isLoading={isLoadingAds}
          headers={headersAds}
          rows={dataFiltered.map(renderRowsByHeaderAds)}
          mainFieldOrdered='start_date'
        />
      );
    }
    return (
      <TableRevly
        isLoading={isLoadingOffers}
        headers={headersOffers}
        rows={dataFiltered.map(renderRowsByHeaderOffer)}
        mainFieldOrdered='start_date'
        onClickRow={handleRowClick}
      />
    );
  };

  const CloseFilterPopup = (cancel = false) => {
    if (cancel) {
      setFilters(JSON.parse(filtersSaved as string));
    }

    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };

  const isEmptyList = () => {
    const source = active ? ads : offers;

    return source.length < 1;
  };

  useEffect(() => {
    const source = active ? ads : offers;
    const preHead = source.reduce(
      (acc, cur) => {
        const { platform, type_offer: discountType, discount_rate: procent, status } = acc;

        if (!platform.includes(cur.platform.toLowerCase()) && cur.platform)
          platform.push(cur.platform.toLowerCase());

        if (!discountType.includes(cur.type_offer) && cur.type_offer)
          discountType.push(cur.type_offer);

        if (!procent.includes(cur.discount_rate) && cur.discount_rate)
          procent.push(cur.discount_rate);

        if (!status.includes(active ? cur.ad_status : cur.status))
          status.push(active ? cur.ad_status : cur.status);

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

    const renderStatusFilter = (s) => {
      if (!s) return null;

      return (
        <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
          {s}
        </span>
      );
    };

    const renderPlatformInsideFilter = (s) => (
      <div key={s}>
        <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
      </div>
    );

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s.toLowerCase(),
      text: renderPlatformInsideFilter(s.toLowerCase()),
    }));

    const preHeadTypeOffer = preHead.type_offer.map((s) => ({ value: s, text: s }));
    const preHeadProcent = preHead.discount_rate.map((s) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatusFilter(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      type_offer: active ? [] : preHeadTypeOffer,
      discount_rate: active ? [] : preHeadProcent,
      status: preHeadStatus,
    });
  }, [ads, offers, active, JSON.stringify(dateRange)]);

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

  useEffect(() => {
    let filteredData = active ? ads : offers;

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) => filters.platform.includes(f.platform));
    }

    if (filters.type_offer.length > 0) {
      filteredData = filteredData.filter((f) => filters.type_offer.includes(f.type_offer));
    }

    if (filters.discount_rate.length > 0) {
      filteredData = filteredData.filter((f) => filters.discount_rate.includes(f.discount_rate));
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) =>
        filters.status.includes(active ? f.ad_status : f.status)
      );
    }

    setDataFiltered(filteredData);
  }, [JSON.stringify(filters), ads, offers, active, JSON.stringify(dateRange)]);

  const renderLayout = () => {
    if (opened) {
      return (
        <OfferDetailComponent
          // eslint-disable-next-line eqeqeq
          data={offers.find((o) => o.master_offer_id == clickedId)}
          setOpened={setOpened}
        />
      );
    }
    return (
      <PaperKit className='marketing-paper offer-paper'>
        <div className='right-part'>
          <div className='right-part-header planning-links'>
            <TypographyKit
              className={`right-part-header_link planning ${active ? 'active' : ''}`}
              variant='div'
            >
              <BoxKit className={!active ? 'active' : ''} onClick={() => setActive(0)}>
                <img src={offerIcon} alt='Offers managment icon' />
                Planning Offers
              </BoxKit>
              <BoxKit className={active ? 'active' : ''} onClick={() => setActive(1)}>
                <img src={adsIcon} alt='Offer Performence icon' />
                Planning Ads
              </BoxKit>
            </TypographyKit>
          </div>
        </div>
        <TypographyKit variant='div' className='marketing-paper-top-btns'>
          <div className='marketing-filters'>
            <div>
              <FilterDropdown
                items={filtersHead.platform}
                values={filters.platform}
                onChange={handleChangeMultipleFilter('platform')}
                label='Platform'
                icon={<Layers />}
                internalIconOnActive={platformObject}
                maxShowned={1}
              />
              {active ? null : (
                <FilterDropdown
                  items={filtersHead.type_offer}
                  values={filters.type_offer}
                  onChange={handleChangeMultipleFilter('type_offer')}
                  label='Discount Type'
                  icon={<Tag />}
                  maxShowned={1}
                />
              )}
              {active ? null : (
                <FilterDropdown
                  items={filtersHead.discount_rate}
                  values={filters.discount_rate}
                  onChange={handleChangeMultipleFilter('discount_rate')}
                  label='Discount Amount'
                  icon={<Tag />}
                  customTag='%'
                  maxShowned={5}
                />
              )}
            </div>
            <div>
              <ButtonKit
                className='more-filter'
                variant='outlined'
                onClick={() => setOpenedFilter(true)}
                disabled={isEmptyList()}
              >
                <Vector />
                More Filters
              </ButtonKit>
            </div>
          </div>
        </TypographyKit>
        {renderTable()}
      </PaperKit>
    );
  };

  return (
    <div className='wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates offer beforePeriodBtn={dateRange} setbeforePeriodBtn={setDateRange} />
      </div>
      {renderLayout()}
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
