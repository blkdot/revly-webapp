import { pascalCase } from 'change-case';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import shortid from 'shortid';

import { endOfMonth, endOfWeek } from 'date-fns/esm';
import Layers from '../../assets/icons/Layers';
import Tag from '../../assets/icons/Tag';
import Vector from '../../assets/icons/Vector';
import adsIcon from '../../assets/images/ic_ads.png';
import offerIcon from '../../assets/images/ic_offers.png';
import Dates from '../../components/dates/Dates';
import FilterDropdown from '../../components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from '../../components/marketingOfferFilter/MarketingOfferFilter';
import RestaurantDropdownNew from '../../components/restaurantDropdown/RestaurantDropdownNew';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import { platformObject } from '../../data/platformList';
import useDate from '../../hooks/useDate';
import usePlanningAds from '../../hooks/usePlanningAds';
import usePlanningOffers from '../../hooks/usePlanningOffers';
import useQueryState from '../../hooks/useQueryState';
import BoxKit from '../../kits/box/BoxKit';
import ButtonKit from '../../kits/button/ButtonKit';
import PaperKit from '../../kits/paper/PaperKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import { vendorsAtom } from '../../store/vendorsAtom';
import OfferDetailComponent from '../offers/details';
import './Planning.scss';

const defaultFilterStateFormat = {
  platform: [],
  discount_type: [],
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
    renderCalculatedPercent,
    renderRowTooltip,
  } = useTableContentFormatter();

  const headersOffers = [
    { id: 'vendor_name', disablePadding: true, label: 'Vendor name' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'start_date', disablePadding: true, label: 'Start date' },
    { id: 'end_date', disablePadding: true, label: 'End date' },
    { id: 'type_schedule', disablePadding: true, label: 'Schedule type' },
    { id: 'slot_schedule', disablePadding: true, label: 'Slot Schedule' },
    { id: 'discount_type', disablePadding: true, label: 'Discount type' },
    { id: 'discount_rate', disablePadding: true, label: 'Discount rate' },
    { id: 'minimum_order_value', disablePadding: true, label: 'Minimum order value' },
    { id: 'target', disablePadding: true, label: 'Target' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const headersAds = [
    { id: 'chain_name', disablePadding: true, label: 'Chain name' },
    { id: 'vendor_names', disablePadding: true, label: 'Vendors' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'start_date', disablePadding: true, label: 'Start date' },
    { id: 'end_date', disablePadding: true, label: 'End date' },
    { id: 'total_budget', disablePadding: true, label: 'Budget' },
    { id: 'ad_status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    chain_name: renderSimpleRowNotCentered,
    vendor_name: renderSimpleRowNotCentered,
    platform: renderPlatform,
    vendor_names: renderRowTooltip,
    start_date: renderSimpleRow,
    end_date: renderSimpleRow,
    type_schedule: renderScheduleType,
    slot_schedule: renderSimpleRow,
    discount_type: renderSimpleRow,
    discount_rate: renderPercent,
    minimum_order_value: renderCurrency,
    attributed_order_value: renderCurrency,
    target: renderTarget,
    status: renderStatus,
    ad_status: renderStatus,
    ad_serving_count: renderSimpleRow,
    clicks_count: renderSimpleRow,
    conversion_rate: renderCalculatedPercent,
    new_customer_count: renderSimpleRow,
    orders_count: renderSimpleRow,
    remaining_budget: renderCurrency,
    return_on_ad_spent: renderCurrency,
    spend: renderCurrency,
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
      {},
    );

  const renderRowsByHeaderAds = (r) =>
    headersAds.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]({ ...r, id: r.offer_id }, cur),
        id: `${cur.id}_${r.ad_id}_ads_${shortid.generate()}`,
        data: r,
      }),
      {},
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
          mainFieldOrdered="start_date"
        />
      );
    }
    return (
      <TableRevly
        isLoading={isLoadingOffers}
        headers={headersOffers}
        rows={dataFiltered.map(renderRowsByHeaderOffer)}
        mainFieldOrdered="start_date"
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
        const { platform, discount_type: discountType, discount_rate: procent, status } = acc;

        if (!platform.includes(cur.platform) && cur.platform) platform.push(cur.platform);

        if (!discountType.includes(cur.discount_type) && cur.discount_type)
          discountType.push(cur.discount_type);

        if (!procent.includes(cur.discount_rate) && cur.discount_rate)
          procent.push(cur.discount_rate);

        if (!status.includes(active ? cur.ad_status : cur.status))
          status.push(active ? cur.ad_status : cur.status);

        return { ...acc, platform, discount_type: discountType, discount_rate: procent, status };
      },
      { discount_type: [], platform: [], discount_rate: [], status: [] },
    );

    const clonedFilters = { ...filters };

    clonedFilters.platform.forEach((fp, i) => {
      if (!preHead.platform.includes(fp)) clonedFilters.platform.splice(i, 1);
    });

    clonedFilters.discount_type.forEach((fp, i) => {
      if (!preHead.discount_type.includes(fp)) clonedFilters.discount_type.splice(i, 1);
    });

    clonedFilters.discount_rate.forEach((fp, i) => {
      if (!preHead.discount_rate.includes(fp)) clonedFilters.discount_rate.splice(i, 1);
    });

    clonedFilters.status.forEach((fp, i) => {
      if (!preHead.status.includes(fp)) clonedFilters.status.splice(i, 1);
    });

    setFilters(clonedFilters);

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s,
      text: renderPlatformInsideFilter(s),
    }));

    const preHeadDiscountType = preHead.discount_type.map((s) => ({ value: s, text: s }));
    const preHeadProcent = preHead.discount_rate.map((s) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatusFilter(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      discount_type: active ? [] : preHeadDiscountType,
      discount_rate: active ? [] : preHeadProcent,
      status: preHeadStatus,
    });
  }, [ads, offers, active, JSON.stringify(dateRange)]);

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

    if (filters.discount_type.length > 0) {
      filteredData = filteredData.filter((f) => filters.discount_type.includes(f.discount_type));
    }

    if (filters.discount_rate.length > 0) {
      filteredData = filteredData.filter((f) => filters.discount_rate.includes(f.discount_rate));
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) =>
        filters.status.includes(active ? f.ad_status : f.status),
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
      <PaperKit className="marketing-paper offer-paper">
        <div className="right-part">
          <div className="right-part-header planning-links">
            <TypographyKit
              className={`right-part-header_link planning ${active ? 'active' : ''}`}
              variant="div"
            >
              <BoxKit className={!active ? 'active' : ''} onClick={() => setActive(0)}>
                <img src={offerIcon} alt="Offers managment icon" />
                Planning Offers
              </BoxKit>
              <BoxKit className={active ? 'active' : ''} onClick={() => setActive(1)}>
                <img src={adsIcon} alt="Offer Performence icon" />
                Planning Ads
              </BoxKit>
            </TypographyKit>
          </div>
        </div>
        <TypographyKit variant="div" className="marketing-paper-top-btns">
          <div className="marketing-filters">
            <div>
              <FilterDropdown
                items={filtersHead.platform}
                values={filters.platform}
                onChange={handleChangeMultipleFilter('platform')}
                label="Platform"
                icon={<Layers />}
                internalIconOnActive={platformObject}
                maxShowned={1}
              />
              {active ? null : (
                <FilterDropdown
                  items={filtersHead.discount_type}
                  values={filters.discount_type}
                  onChange={handleChangeMultipleFilter('discount_type')}
                  label="Discount Type"
                  icon={<Tag />}
                  maxShowned={1}
                />
              )}
              {active ? null : (
                <FilterDropdown
                  items={filtersHead.discount_rate}
                  values={filters.discount_rate}
                  onChange={handleChangeMultipleFilter('discount_rate')}
                  label="Discount Amount"
                  icon={<Tag />}
                  customTag="%"
                  maxShowned={5}
                />
              )}
            </div>
            <div>
              <ButtonKit
                className="more-filter"
                variant="outlined"
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
    <div className="wrapper">
      <div className="top-inputs">
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdownNew chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            vendorsSelected={vendorsSelected}
            vendors={vendorsArr}
            vendorsPlatform={Object.keys(vendorsObj)}
          />
        )}
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
