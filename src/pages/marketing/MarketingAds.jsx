import React, { useEffect, useState } from 'react';
import { pascalCase } from 'change-case';
import { endOfMonth, endOfWeek } from 'date-fns';
import logo from '../../assets/images/small-logo.png';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown.suspended';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Marketing.scss';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import MarketingSetup from '../../components/marketingSetup/MarketingSetup';
import BoxKit from '../../kits/box/BoxKit';
import useDate from '../../hooks/useDate';
import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import PaperKit from '../../kits/paper/PaperKit';
import { AdsTableData } from '../../data/fakeDataMarketing';
import { platformObject } from '../../data/platformList';
import usePlanningAds from '../../hooks/usePlanningAds';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevly from '../../components/tableRevly/TableRevly';
import { defaultFilterStateFormat } from './marketingOfferData';
import MarketingOfferFilter from '../../components/marketingOfferFilter/MarketingOfferFilter';
import FilterDropdown from '../../components/filter/filterDropdown/FilterDropdown';
import Layers from '../../assets/icons/Layers';
import Vector from '../../assets/icons/Vector';
import RestaurantDropdownOld from '../../components/restaurantDropdown/RestaurantDropdownOld';

const MarketingAds = () => {
  const [active, setActive] = useState(false);
  const { date } = useDate();
  const { vendors } = useDate();
  const { vendorsArr, restaurants, vendorsObj, display, chainObj } = vendors;
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
    startDate: date.beforePeriod.startDate,
    endDate: getOfferDate(),
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange: beforePeriodBtn });

  const {
    renderPlatform,
    renderPercent,
    renderCurrency,
    renderStatus,
    renderTarget,
    renderSimpleRow,
    renderSimpleRowNotCentered,
    renderScheduleType,
    renderCalculatedPercent,
  } = useTableContentFormatter();

  const headersAds = [
    { id: 'vendor_name', disablePadding: true, label: 'Vendor name' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'ad_serving_count', disablePadding: true, label: 'Impressions' },
    { id: 'start_date', disablePadding: true, label: 'Start date' },
    { id: 'end_date', disablePadding: true, label: 'End date' },
    { id: 'attributed_order_value', disablePadding: true, label: 'Attributed order value' },
    { id: 'clicks_count', disablePadding: true, label: 'Clicks' },
    { id: 'conversion_rate', disablePadding: true, label: 'Conversion rate' },
    { id: 'new_customers_count', disablePadding: true, label: 'New customers' },
    { id: 'orders_count', disablePadding: true, label: 'Orders' },
    { id: 'remaining_budget', disablePadding: true, label: 'Remaining budget' },
    { id: 'spend', disablePadding: true, label: 'Spend' },
    { id: 'return_on_ad_spent', disablePadding: true, label: 'Return on spent' },
    { id: 'total_budget', disablePadding: true, label: 'Total budget' },
    { id: 'ad_status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    vendor_name: renderSimpleRowNotCentered,
    platform: renderPlatform,
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
    new_customers_count: renderSimpleRow,
    orders_count: renderSimpleRow,
    remaining_budget: renderCurrency,
    return_on_ad_spent: renderCurrency,
    spend: renderCurrency,
    total_budget: renderCurrency,
  };

  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(AdsTableData);

  const handleScroll = () => {
    const cont = document.querySelector('#tableContainer');
    const position = cont.scrollLeft;
    setScrollPosition(position);
  };

  const scrollToPos = (pos) => {
    const cont = document.querySelector('#tableContainer');
    cont?.scrollTo(pos, 0);
  };
  const [adsData, setAdsData] = useState(AdsTableData);
  const [adsFilteredData, setAdsFilteredData] = useState(AdsTableData);

  const [filters, setFilters] = useState({
    platform: [],
    status: [],
  });
  const [filtersHead, setFiltersHead] = useState({
    platform: [],
    status: [],
  });

  useEffect(() => {
    setAdsData(ads);
    setRow(ads);
  }, [ads]);

  useEffect(() => {
    const cont = document.querySelector('#tableContainer');
    cont.addEventListener('scroll', handleScroll);
    return () => {
      cont.removeEventListener('scroll', handleScroll);
    };
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

        if (!platform.includes(cur.platform)) platform.push(cur.platform);

        if (!status.includes(cur.status)) status.push(cur.ad_status);

        return {
          ...acc,
          platform,
          status,
        };
      },
      { platform: [], status: [] },
    );

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s,
      text: renderPlatformInsideFilter(s),
    }));

    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatusFilter(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      status: preHeadStatus,
    });
  }, [JSON.stringify(adsData)]);

  useEffect(() => {
    let filteredData = adsData;

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) => filters.platform.includes(f.platform));
    }

    if (filters.status.length > 0) {
      filteredData = filteredData.filter((f) => filters.status.includes(f.ad_status));
    }
    setAdsFilteredData(filteredData);
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
  const renderRowsByHeader = (r) =>
    headersAds.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: `${cur.id}_${r.offer_id}`,
        data: r,
      }),
      {},
    );
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

  const getAdsTable = () => (
    <TableRevly
      isLoading={isLoadingAds}
      headers={headersAds}
      rows={adsFilteredData.map(renderRowsByHeader)}
      mainFieldOrdered="start_date"
    />
  );

  return (
    <div className="wrapper marketing-wrapper">
      <div className="top-inputs">
        {Object.keys(display).length > 0 ? (
          <RestaurantDropdown chainObj={chainObj} />
        ) : (
          <RestaurantDropdownOld
            restaurants={restaurants}
            vendors={vendorsArr}
            vendorsPlatform={Object.keys(vendorsObj)}
          />
        )}
        <Dates offer beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
      </div>
      <div className="marketing-top">
        <div className="marketing-top-text">
          <TypographyKit variant="h4">Marketing - Ads</TypographyKit>
          <TypographyKit color="#637381" variant="subtitle">
            Create and manage all your offers. Set personalised rules to automatically trigger your
            Ads.
          </TypographyKit>
        </div>
        <div className="markting-top-btns">
          <ButtonKit disabled className="sm-rule-btn disabled" variant="outlined">
            <img src={SmartRuleBtnIcon} alt="Smart rule icon" />
            Create a smart rule
          </ButtonKit>
          <ButtonKit disabled variant="contained">
            <img src={SettingFuture} alt="Setting future icon" />
            Set up an ad
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
              <div tabIndex={-1} role="presentation" onClick={() => scrollToPos(0)}>
                <BoxKit className={scrollPosition < 310 ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Ads Management
                </BoxKit>
              </div>
              <div tabIndex={-1} role="presentation" onClick={() => scrollToPos(1500)}>
                <BoxKit className={scrollPosition > 310 ? 'active' : ''}>
                  <img src={OffersPerformenceIcon} alt="Offer Performence icon" />
                  Ads Performance
                </BoxKit>
              </div>
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
        {getAdsTable()}
      </PaperKit>
      <MarketingSetup ads active={active} setActive={setActive} />
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => setOpened(false)}
        className={`delete-overlay ${opened ? 'active' : ''}`}
      >
        <PaperKit onClick={(e) => e.stopPropagation()} className="marketing-paper">
          <div>
            <img src={logo} alt="logo" />
            <TypographyKit>Are you sure you want to delete this offer ?</TypographyKit>
          </div>
          <TypographyKit>
            Amet, morbi egestas ultrices id non a. Est morbi consequat quis ac, duis elit, eleifend.
            Tellus diam mi phasellus facilisi id iaculis egestas.
          </TypographyKit>
          <div>
            <ButtonKit onClick={() => CancelAd()} variant="contained">
              Cancel Offer
            </ButtonKit>
            <ButtonKit onClick={() => setOpened(false)} variant="outlined">
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
