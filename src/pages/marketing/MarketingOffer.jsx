import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { pascalCase } from 'change-case';

import { startOfWeek } from 'date-fns';
import CloseIcon from '../../assets/images/ic_close.png';
import logo from '../../assets/images/small-logo.png';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import ButtonKit from '../../kits/button/ButtonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import './Marketing.scss';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import MarketingSetup from '../../components/marketingSetup/MarketingSetup';
import BoxKit from '../../kits/box/BoxKit';
import useVendors from '../../hooks/useVendors';
import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import PaperKit from '../../kits/paper/PaperKit';
import MarketingTable from '../../components/marketingTable/MarketingTable';
// import { OffersTableData } from '../../data/fakeDataMarketing';
import FilterDropdown from '../../components/filter/filterDropdown/FilterDropdown';
import Layers from '../../assets/icons/Layers';
import Tag from '../../assets/icons/Tag';
import Vector from '../../assets/icons/Vector';
import Switch from '../../assets/icons/Switch';
import Basket from '../../assets/icons/Basket';
import { platformObject } from '../../data/platformList';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import usePlanningOffers from '../../hooks/usePlanningOffers';

const fomatOffers = (os) =>
  os.map((o) => ({
    date: o.start_date,
    branche: o.vendor_name,
    platform: o.platform,
    // day: 'Mocked',
    // slot: 'Mocked',
    discountType: o.discount_type,
    procent: o.discount_rate,
    minOrder: o.minimum_order_value,
    target: o.target,
    status: o.status,
    // discountTypePr: 'Mocked',
    // targetPr: 'Mocked',
    // statusPr: 'Mocked',
    // caroussel: 'Mocked',
    // rank: 'Mocked',
    orders: o.data?.n_orders || '-',
    avgBasket: o.data?.average_basket || '-',
    roi: o.data?.roi || '-',
    revenue: o.data?.revenue || '-',
    id: o.offer_id,
  }));

const MarketingOffer = () => {
  const [active, setActive] = useState(false);
  const { vendors, vendorsPlatform } = useVendors();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: new Date(),
  });
  const { offers } = usePlanningOffers({ dateRange: beforePeriodBtn });

  /*  {
    data: {
      accrued_discount: 29.4;
      average_basket: 98;
      n_orders: 1;
      revenue: 98;
      roi: 2.33;
    }
    discount_rate: 30;
    discount_type: 'Menu discount';
    end_date: '22/09 at 18:59';
    master_id: null;
    menu_items: null;
    minimum_order_value: 30;
    offer_id: 2839815;
    platform: 'deliveroo';
    start_date: '22/09 at 15:00';
    status: 'Ended';
    target: 'Everyone';
    type_schedule: null;
    vendor_id: 126601;
    vendor_name: "Adam's Kitchen";
  } */

  const [scrollPosition, setScrollPosition] = useState(0);
  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(fomatOffers(offers));
  const handleScroll = () => {
    const cont = document.querySelector('#markeitngContainer');
    const position = cont.scrollLeft;
    setScrollPosition(position);
  };
  const [offersData, setOffersData] = useState(fomatOffers(offers));
  const [offersDataFiltered, setOffersDataFiltered] = useState([]);
  const [avgBasketRange, setAvgBasketRange] = useState({ min: '', max: '' });

  useEffect(() => {
    setOffersData(fomatOffers(offers));
    setRow(fomatOffers(offers));
  }, [offers]);

  const [filters, setFilters] = useState({
    platform: [],
    discountType: [],
    procent: [],
    status: [],
  });
  const [filtersHead, setFiltersHead] = useState({
    platform: [],
    discountType: [],
    procent: [],
    status: [],
  });

  const renderStatus = (s) => {
    if (!s) return null;

    return (
      <span style={{ whiteSpace: 'nowrap' }} className={`competition-status ${s}`}>
        {s}
      </span>
    );
  };
  useEffect(() => {
    const cont = document.querySelector('#markeitngContainer');
    cont.addEventListener('scroll', handleScroll);
    return () => {
      cont.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const preHead = offersData.reduce(
      (acc, cur) => {
        const { platform, discountType, procent, status } = acc;

        if (!platform.includes(cur.platform)) platform.push(cur.platform);

        if (!discountType.includes(cur.discountType)) discountType.push(cur.discountType);

        if (!procent.includes(cur.procent)) procent.push(cur.procent);

        if (!status.includes(cur.status)) status.push(cur.status);

        return { ...acc, platform, discountType, procent, status };
      },
      { discountType: [], platform: [], procent: [], status: [] },
    );

    const preHeadPlatform = preHead.platform.map((s) => ({
      value: s,
      text: renderPlatformInsideFilter(s),
    }));
    const preHeadDiscountType = preHead.discountType.map((s) => ({ value: s, text: s }));
    const preHeadProcent = preHead.procent.map((s) => ({ value: s, text: `${s} %` }));
    const preHeadStatus = preHead.status.map((s) => ({ value: s, text: renderStatus(s) }));

    setFiltersHead({
      platform: preHeadPlatform,
      discountType: preHeadDiscountType,
      procent: preHeadProcent,
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
      setFilters({
        platform: [],
        discountType: [],
        procent: [],
        status: [],
      });

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
        (f) => f.avgBasket >= avgBasketRange.min && f.avgBasket <= avgBasketRange.max,
      );
    }

    if (filters.platform.length > 0) {
      filteredData = filteredData.filter((f) => filters.platform.includes(f.platform));
    }

    if (filters.discountType.length > 0) {
      filteredData = filteredData.filter((f) => filters.discountType.includes(f.discountType));
    }

    if (filters.procent.length > 0) {
      filteredData = filteredData.filter((f) => filters.procent.includes(f.procent));
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
              variant="div">
              <HashLink to="#dateMn">
                <BoxKit className={scrollPosition < 310 ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Offers Management
                </BoxKit>
              </HashLink>
              <HashLink to="#revenuePr">
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
                items={filtersHead.discountType}
                values={filters.discountType}
                onChange={handleChangeMultipleFilter('discountType')}
                label="Discount Type"
                icon={<Tag />}
                maxShowned={1}
              />
              <FilterDropdown
                items={filtersHead.procent}
                values={filters.procent}
                onChange={handleChangeMultipleFilter('procent')}
                label="Discount Amount"
                icon={<Tag />}
                customTag="%"
                maxShowned={5}
              />
            </div>
            <ButtonKit
              className="more-filter"
              variant="outlined"
              onClick={() => setOpenedFilter(true)}>
              <Vector />
              More Filters
            </ButtonKit>
          </div>
        </TypographyKit>
        <MarketingTable selected={selected} rows={offersDataFiltered} offers={offers} />
      </PaperKit>
      <MarketingSetup active={active} setActive={setActive} />
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => setOpened(false)}
        className={`delete-overlay ${opened ? 'active' : ''}`}>
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
            <ButtonKit onClick={() => CancelOffer()} variant="contained">
              Cancel Offer
            </ButtonKit>
            <ButtonKit onClick={() => setOpened(false)} variant="outlined">
              Cancel
            </ButtonKit>
          </div>
        </PaperKit>
      </div>
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => CloseFilterPopup(true)}
        className={`filter-overlay${openedFilter ? ' active' : ''}`}>
        <PaperKit onClick={(e) => e.stopPropagation()} className="marketing-paper filter-paper">
          <div>
            <TypographyKit>More Filters</TypographyKit>
            <img
              role="presentation"
              tabIndex={-1}
              onClick={() => CloseFilterPopup(true)}
              src={CloseIcon}
              alt="close icon"
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '2rem',
              flexDirection: 'column',
            }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <Layers /> Platform
            </span>
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
              {filtersHead.platform.map((item) => (
                <div
                  key={item.value}
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    width: '42%',
                  }}>
                  <CheckboxKit
                    checked={filters.platform.includes(item.value)}
                    onChange={() => handleChangeMultipleFilter('platform')(item.value)}
                  />
                  <span style={{ alignSelf: 'center' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '2rem',
              flexDirection: 'column',
            }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <Tag /> Discount Type
            </span>
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
              {filtersHead.discountType.map((item) => (
                <div
                  key={item.value}
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    marginRight: '1rem',
                    marginTop: '1rem',
                    width: '80%',
                  }}>
                  <CheckboxKit
                    checked={filters.discountType.includes(item.value)}
                    onChange={() => handleChangeMultipleFilter('discountType')(item.value)}
                  />
                  <span style={{ display: 'flex', alignSelf: 'center' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '2rem',
              flexDirection: 'column',
            }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <Tag /> Discount Amount %
            </span>
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
              {filtersHead.procent.map((item) => (
                <div
                  key={item.value}
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    marginRight: '1rem',
                    marginTop: '1rem',
                    width: '18%',
                  }}>
                  <CheckboxKit
                    checked={filters.procent.includes(item.value)}
                    onChange={() => handleChangeMultipleFilter('procent')(item.value)}
                  />
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '2rem',
              flexDirection: 'column',
            }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}>
              <Switch />
              &nbsp; Status
            </span>
            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
              {filtersHead.status.map((item) => (
                <div
                  key={item.value}
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    marginRight: '1rem',
                    marginTop: '1rem',
                    width: '42%',
                  }}>
                  <CheckboxKit
                    checked={filters.status.includes(item.value) || false}
                    onChange={() => handleChangeMultipleFilter('status')(item.value)}
                  />
                  <span style={{ display: 'flex', alignSelf: 'center' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '2rem',
              flexDirection: 'column',
            }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}>
              <Basket />
              &nbsp; Avg Basket
            </span>
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  marginRight: '0.5rem',
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}>
                <span style={{ fontSize: '12px' }}>Min</span>
                <TextfieldKit
                  placeholder="$ 0"
                  type="number"
                  value={avgBasketRange.min}
                  onChange={(e) => setAvgBasketRange({ ...avgBasketRange, min: e.target.value })}
                />
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}>
                <span style={{ fontSize: '12px' }}>Max</span>
                <TextfieldKit
                  placeholder="-"
                  type="number"
                  value={avgBasketRange.max}
                  onChange={(e) => setAvgBasketRange({ ...avgBasketRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonKit
              variant="contained"
              style={{ marginRight: '1rem' }}
              onClick={() => CloseFilterPopup(false)}>
              Confirm and Filter
            </ButtonKit>
            <ButtonKit variant="outlined" onClick={() => CloseFilterPopup(true)}>
              Cancel
            </ButtonKit>
          </div>
        </PaperKit>
      </div>
    </div>
  );
};

export default MarketingOffer;
