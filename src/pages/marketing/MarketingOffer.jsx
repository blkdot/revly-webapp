import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { startOfWeek } from 'date-fns';
import { pascalCase } from 'change-case';
import _ from 'lodash';

import './Marketing.scss';

import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import MarketingSetup from '../../components/marketingSetup/MarketingSetup';
import FilterDropdown from '../../components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from '../../components/marketingOfferFilter/MarketingOfferFilter';
import MarketingOfferRemove from '../../components/marketingOfferRemove/MarketingOfferRemove';
import TableRevly from '../../components/tableRevly/TableRevly';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';

import { platformObject } from '../../data/platformList';

import TypographyKit from '../../kits/typography/TypographyKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import ButtonKit from '../../kits/button/ButtonKit';

import usePlanningOffers from '../../hooks/usePlanningOffers';
import useVendors from '../../hooks/useVendors';

import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import Layers from '../../assets/icons/Layers';
import Tag from '../../assets/icons/Tag';
import Vector from '../../assets/icons/Vector';

import { defaultFilterStateFormat } from './marketingOfferData';

const MarketingOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const { vendors, vendorsPlatform } = useVendors();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: new Date(),
  });
  const { offers, isLoading: isLoadingOffers } = usePlanningOffers({ dateRange: beforePeriodBtn });

  const [scrollPosition, setScrollPosition] = useState(0);
  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(offers);

  const handleScroll = () => {
    const cont = document.querySelector('#tableContainer');
    const position = cont.scrollLeft;

    setScrollPosition(position);
  };
  const [offersData, setOffersData] = useState(offers);
  const [offersDataFiltered, setOffersDataFiltered] = useState([]);
  const [avgBasketRange, setAvgBasketRange] = useState({ min: '', max: '' });

  const [filters, setFilters] = useState(defaultFilterStateFormat);

  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);

  useEffect(() => {
    setOffersData(offers);
    setRow(offers);
  }, [offers]);

  const {
    renderPlatform,
    renderPercent,
    renderCurrency,
    renderStatus,
    renderTarget,
    renderSimpleRow,
  } = useTableContentFormatter();

  const headersOffers = [
    {
      id: 'start_date',
      numeric: false,
      disablePadding: true,
      label: 'Date',
    },
    {
      id: 'vendor_name',
      numeric: false,
      disablePadding: false,
      label: 'Branche',
    },
    {
      id: 'platform',
      numeric: true,
      disablePadding: false,
      label: 'Platfrom',
    },
    {
      id: 'discount_type',
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
      label: 'Target',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'data.n_orders',
      numeric: true,
      disablePadding: false,
      label: '#Orders',
    },
    {
      id: 'data.average_basket',
      numeric: true,
      disablePadding: false,
      label: 'Avg Basket',
    },
    {
      id: 'data.roi',
      numeric: true,
      disablePadding: false,
      label: 'ROI',
    },
    {
      id: 'data.revenue',
      numeric: true,
      disablePadding: false,
      label: 'Revenue',
    },
  ];

  const cellTemplatesObject = {
    vendor_name: renderSimpleRow,
    platform: renderPlatform,
    start_date: renderSimpleRow,
    discount_type: renderSimpleRow,
    discount_rate: renderPercent,
    target: renderTarget,
    minimum_order_value: renderSimpleRow,
    status: renderStatus,
    'data.n_orders': renderSimpleRow,
    'data.average_basket': renderSimpleRow,
    'data.roi': renderSimpleRow,
    'data.revenue': renderCurrency,
  };

  const renderRowsByHeader = (r, i) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id]
          ? cellTemplatesObject[cur.id]({ ...r, [cur.id]: _.get(r, cur.id) }, cur, i)
          : r[cur.id],
        id: `${cur.id}_${r.offer_id}`,
      }),
      {},
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
    cont.addEventListener('scroll', handleScroll);
    return () => {
      cont.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const preHead = offersData.reduce(
      (acc, cur) => {
        const { platform, discount_type: discountType, discount_rate: procent, status } = acc;

        if (!platform.includes(cur.platform)) platform.push(cur.platform);

        if (!discountType.includes(cur.discountType)) discountType.push(cur.discountType);

        if (!procent.includes(cur.procent)) procent.push(cur.procent);

        if (!status.includes(cur.status)) status.push(cur.status);

        return { ...acc, platform, discountType, procent, status };
      },
      { discount_type: [], platform: [], discount_rate: [], status: [] },
    );

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s,
      text: renderPlatformInsideFilter(s),
    }));

    const preHeadDiscountType = preHead.discount_type.map((s) => ({ value: s, text: s }));
    const preHeadProcent = preHead.discount_rate.map((s) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatusFilter(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      discount_type: preHeadDiscountType,
      discount_rate: preHeadProcent,
      status: preHeadStatus,
    });
  }, [JSON.stringify(offersData)]);

  const renderPlatformInsideFilter = (s) => (
    <div key={s}>
      <img src={platformObject[s].src} alt={s} width={30} style={{ verticalAlign: 'middle' }} />
      <span style={{ verticalAlign: 'middle' }}>{pascalCase(s)}</span>
    </div>
  );
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

      setAvgBasketRange({ min: '', max: '' });
    }
    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };

  useEffect(() => {
    let filteredData = offersData;

    if (avgBasketRange.min && avgBasketRange.max && avgBasketRange.max > avgBasketRange.min) {
      filteredData = filteredData.filter(
        (f) =>
          f['data.average_basket'] >= avgBasketRange.min &&
          f['data.average_basket'] <= avgBasketRange.max,
      );
    }

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
      filteredData = filteredData.filter((f) => filters.status.includes(f.status));
    }

    setOffersDataFiltered(filteredData);
  }, [JSON.stringify(filters), JSON.stringify(avgBasketRange), offersData]);

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

  const handleRowClick = (id) => {
    const rowId = id.split('_');

    navigate(`/offer/detail/${rowId[1]}`, {
      state: {
        // eslint-disable-next-line eqeqeq
        offerDetail: offers.find((o) => o.offer_id == rowId[1]),
        prevPath: location.pathname,
      },
    });
  };

  return (
    <div className="wrapper marketing-wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates offer beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <div className="marketing-top">
        <div className="marketing-top-text">
          <TypographyKit variant="h4">Marketing - Offers</TypographyKit>
          <TypographyKit color="#637381" variant="subtitle">
            Create and manage all your offers. Set personalised rules to automatically trigger your
            offers.
          </TypographyKit>
        </div>
        <div className="markting-top-btns">
          <ButtonKit disabled className="sm-rule-btn disabled" variant="outlined">
            <img src={SmartRuleBtnIcon} alt="Smart rule icon" />
            Create a smart rule
          </ButtonKit>
          <ButtonKit onClick={() => OpenSetup()} variant="contained">
            <img src={SettingFuture} alt="Setting future icon" />
            Set up an offer
          </ButtonKit>
        </div>
      </div>
      <PaperKit className="marketing-paper offer-paper">
        <div className="right-part">
          <div className="right-part-header marketing-links">
            <TypographyKit
              className={`right-part-header_link ${scrollPosition > 310 ? 'active' : ''}`}
              variant="div"
            >
              <HashLink to="#start_date_header">
                <BoxKit className={scrollPosition < 310 ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Offers Management
                </BoxKit>
              </HashLink>
              <HashLink to="#data.revenue_header">
                <BoxKit className={scrollPosition > 310 ? 'active' : ''}>
                  <img src={OffersPerformenceIcon} alt="Offer Performence icon" />
                  Offers Performance
                </BoxKit>
              </HashLink>
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
              <FilterDropdown
                items={filtersHead.discount_type}
                values={filters.discount_type}
                onChange={handleChangeMultipleFilter('discount_type')}
                label="Discount Type"
                icon={<Tag />}
                maxShowned={1}
              />
              <FilterDropdown
                items={filtersHead.discount_rate}
                values={filters.discount_rate}
                onChange={handleChangeMultipleFilter('discount_rate')}
                label="Discount Amount"
                icon={<Tag />}
                customTag="%"
                maxShowned={5}
              />
            </div>
            <ButtonKit
              className="more-filter"
              variant="outlined"
              onClick={() => setOpenedFilter(true)}
            >
              <Vector />
              More Filters
            </ButtonKit>
          </div>
        </TypographyKit>
        <TableRevly
          isLoading={isLoadingOffers}
          headers={headersOffers}
          rows={offersDataFiltered.map(renderRowsByHeader)}
          onClickRow={handleRowClick}
        />
      </PaperKit>
      <MarketingSetup active={active} setActive={setActive} />
      <MarketingOfferRemove setOpened={setOpened} opened={opened} CancelOffer={CancelOffer} />
      <MarketingOfferFilter
        CloseFilterPopup={CloseFilterPopup}
        openedFilter={openedFilter}
        filtersHead={filtersHead}
        filters={filters}
        handleChangeMultipleFilter={handleChangeMultipleFilter}
        avgBasketRange={avgBasketRange}
        setAvgBasketRange={setAvgBasketRange}
      />
    </div>
  );
};

export default MarketingOffer;
