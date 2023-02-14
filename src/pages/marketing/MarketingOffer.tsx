/* eslint-disable no-unused-vars */
import { Layers, Tag, Vector } from 'assets/icons';
import { pascalCase } from 'change-case';
import Dates from 'components/dates/Dates';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from 'components/marketingOfferFilter/MarketingOfferFilter';
import MarketingOfferRemove from 'components/marketingOfferRemove/MarketingOfferRemove';
import MarketingSetup from 'components/marketingSetup/MarketingSetup';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from 'components/tableRevly/TableRevly';
import { endOfMonth, endOfWeek } from 'date-fns';
import { useDate, useQueryState } from 'hooks';
import { usePlanningOffersNew } from 'hooks/usePlanningOffers';
import { useAtom } from 'jotai';
import { BoxKit, ButtonKit, PaperKit, TypographyKit } from 'kits';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import { platformObject } from '../../data/platformList';
import OfferDetailComponent from '../offers/details';
import './Marketing.scss';
import { defaultFilterStateFormat } from './marketingOfferData';

const MarketingOffer = () => {
  const [active, setActive] = useState(false);
  const { date: dateContext } = useDate();
  const getOfferDate = () => {
    if (dateContext.typeDate === 'month') {
      return endOfMonth(new Date(dateContext.beforePeriod.endDate));
    }
    if (dateContext.typeDate === 'week') {
      return endOfWeek(new Date(dateContext.beforePeriod.endDate), { weekStartsOn: 1 });
    }
    return dateContext.beforePeriod.endDate;
  };
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: dateContext.beforePeriod.startDate,
    endDate: getOfferDate(),
  });

  const { data, isLoading: isLoadingOffers } = usePlanningOffersNew(beforePeriodBtn);

  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(data?.offers || []);
  const [scrollActive, setScrollActive] = useState('less');
  const handleScroll = () => {
    const cont = document.querySelector('#tableContainer');
    const position = +cont.scrollLeft.toFixed(0);
    if (position < cont.clientWidth / 2) {
      setScrollActive('less');
    } else if (position > cont.clientWidth / 2) {
      setScrollActive('more');
    }
  };
  const handleScrollActive = (type) => {
    const cont = document.querySelector('#tableContainer');
    if (type === 'more') {
      cont.scrollLeft = cont.scrollWidth;
    } else {
      cont.scrollLeft = 0;
    }
  };
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
  const [vendors] = useAtom(vendorsAtom);
  useEffect(() => {
    const arr = [];
    Object.keys(vendors.vendorsObj).forEach((platform) => {
      vendors.vendorsObj[platform]?.forEach((v) =>
        data?.offers.forEach((objOffers) => {
          if (objOffers.vendor_ids?.includes(Number(v.vendor_id)) && v.metadata.is_active) {
            arr.push(objOffers);
          }
        })
      );
    });
    setOffersData(arr || []);
    setRow(arr || []);
  }, [data]);

  const {
    renderPlatform,
    renderPercent,
    renderCurrency,
    renderStatus,
    renderTarget,
    renderSimpleRow,
    renderVendorId,
    renderChainId,
    renderOfferIds,
  } = useTableContentFormatter();

  const headersOffers = [
    // {
    //   id: 'offer_ids',
    //   numeric: false,
    //   disablePadding: false,
    //   label: 'Offer ID Debug',
    // }, // Debug Purpose Only
    {
      id: 'chain_id',
      numeric: false,
      disablePadding: false,
      label: 'Chain Name',
    },
    {
      id: 'vendor_ids',
      numeric: false,
      disablePadding: false,
      label: 'Vendor(s)',
    },
    {
      id: 'start_date',
      numeric: false,
      disablePadding: true,
      label: 'Start date',
    },
    {
      id: 'end_date',
      numeric: false,
      disablePadding: true,
      label: 'End date',
    },
    {
      id: 'platform',
      numeric: true,
      disablePadding: false,
      label: 'Platfrom',
    },
    {
      id: 'type_offer',
      numeric: true,
      disablePadding: false,
      label: 'Discount Type',
    },
    {
      id: 'discount_rate',
      numeric: true,
      disablePadding: false,
      label: '%',
    },
    {
      id: 'minimum_order_value',
      numeric: true,
      disablePadding: false,
      label: 'Min Order',
    },
    {
      id: 'target',
      numeric: true,
      disablePadding: false,
      label: 'goal',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'n_orders',
      numeric: true,
      disablePadding: false,
      label: '#Orders',
    },
    {
      id: 'average_basket',
      numeric: true,
      disablePadding: false,
      label: 'Avg Basket',
    },
    {
      id: 'roi',
      numeric: true,
      disablePadding: false,
      label: 'ROI',
    },
    {
      id: 'revenue',
      numeric: true,
      disablePadding: false,
      label: 'Revenue',
    },
  ];

  const cellTemplatesObject = {
    offer_ids: renderOfferIds,
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    platform: renderPlatform,
    start_date: renderSimpleRow,
    end_date: renderSimpleRow,
    type_offer: renderSimpleRow,
    discount_rate: renderPercent,
    goal: renderTarget,
    minimum_order_value: renderSimpleRow,
    status: renderStatus,
    n_orders: renderSimpleRow,
    average_basket: renderSimpleRow,
    roi: renderSimpleRow,
    revenue: renderCurrency,
  };

  const renderRowsByHeader = (r, i) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]
          ? cellTemplatesObject[cur.id]({ ...r, [cur.id]: _.get(r, cur.id) }, cur, i)
          : r[cur.id],
        id: r.offer_ids.join(''),
        data: r,
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

  useEffect(() => {
    const cont = document.querySelector('#tableContainer');
    cont?.addEventListener('scroll', handleScroll);
    return () => {
      cont?.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

        if (!status.includes(cur.status) && cur.status) status.push(cur.status);

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
    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatusFilter(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      type_offer: preHeadtypeOffer,
      discount_rate: preHeadProcent,
      status: preHeadStatus,
      goal: preHeadTarget,
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

  const isEmptyList = () => offersData.length < 1;

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
      filteredData = filteredData.filter((f) => filters.status.includes(f.status));
    }

    if (filters.goal.length > 0) {
      filteredData = filteredData.filter((f) => filters.goal.includes(f.goal));
    }

    setOffersDataFiltered(filteredData);
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
  const renderLayout = () => {
    if (openedOffer) {
      return (
        <OfferDetailComponent
          // eslint-disable-next-line eqeqeq
          data={data?.offers.find((o) => o.master_offer_id == clickedId)}
          setOpened={setOpenedOffer}
        />
      );
    }
    return (
      <PaperKit className='marketing-paper offer-paper'>
        <div className='right-part'>
          <div className='right-part-header marketing-links'>
            <TypographyKit
              className={`right-part-header_link marketing ${
                scrollActive === 'more' ? 'active' : ''
              }`}
              variant='div'
            >
              <div tabIndex={-1} role='presentation' onClick={() => handleScrollActive('less')}>
                <BoxKit className={scrollActive === 'less' ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt='Offers managment icon' />
                  Offers Management
                </BoxKit>
              </div>
              <div tabIndex={-1} role='presentation' onClick={() => handleScrollActive('more')}>
                <BoxKit className={scrollActive === 'more' ? 'active' : ''}>
                  <img src={OffersPerformenceIcon} alt='Offer Performence icon' />
                  Offers Performance
                </BoxKit>
              </div>
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
              <FilterDropdown
                items={filtersHead.type_offer}
                values={filters.type_offer}
                onChange={handleChangeMultipleFilter('type_offer')}
                label='Discount Type'
                icon={<Tag />}
                maxShowned={1}
              />
              <FilterDropdown
                items={filtersHead.discount_rate}
                values={filters.discount_rate}
                onChange={handleChangeMultipleFilter('discount_rate')}
                label='Discount Amount'
                icon={<Tag />}
                customTag='%'
                maxShowned={5}
              />
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
        <TableRevly
          isLoading={isLoadingOffers}
          headers={headersOffers}
          rows={offersDataFiltered.map(renderRowsByHeader)}
          onClickRow={handleRowClick}
          mainFieldOrdered='start_date'
        />
      </PaperKit>
    );
  };
  return (
    <div className='wrapper marketing-wrapper'>
      <div className='top-inputs'>
        <RestaurantDropdown />
        <Dates offer beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <div className='marketing-top'>
        <div className='marketing-top-text'>
          <TypographyKit variant='h4'>Marketing - Offers</TypographyKit>
          <TypographyKit color='#637381' variant='subtitle'>
            Create and manage all your offers. Set personalised rules to automatically trigger your
            offers.
          </TypographyKit>
        </div>
        <div className='markting-top-btns'>
          <ButtonKit disabled className='sm-rule-btn disabled' variant='outlined'>
            <img src={SmartRuleBtnIcon} alt='Smart rule icon' />
            Create a smart rule
          </ButtonKit>
          <ButtonKit onClick={() => OpenSetup()} variant='contained'>
            <img src={SettingFuture} alt='Setting future icon' />
            Set up an offer
          </ButtonKit>
        </div>
      </div>
      {renderLayout()}
      <MarketingSetup active={active} setActive={setActive} />
      <MarketingOfferRemove setOpened={setOpened} opened={opened} CancelOffer={CancelOffer} />
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

export default MarketingOffer;
