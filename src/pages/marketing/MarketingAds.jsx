import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { pascalCase } from 'change-case';

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
import useDate from '../../hooks/useDate';
import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import PaperKit from '../../kits/paper/PaperKit';
import { AdsTableData } from '../../data/fakeDataMarketing';
import Layers from '../../assets/icons/Layers';
import Tag from '../../assets/icons/Tag';
import Switch from '../../assets/icons/Switch';
import Basket from '../../assets/icons/Basket';
import { platformObject } from '../../data/platformList';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import usePlanningAds from '../../hooks/usePlanningAds';
import PlanningOffersTableEmpty from '../../components/planningOffersTable/PlanningOffersTableEmpty';
import PlanningOffersTable from '../../components/planningOffersTable/PlanningOffersTable';

const MarketingAds = () => {
  const [active, setActive] = useState(false);
  const { vendors, vendorsPlatform } = useVendors();
  const { date } = useDate();
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange: beforePeriodBtn });
  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(AdsTableData);
  const handleScroll = () => {
    const cont = document.querySelector('#adsContainer');
    const position = cont.scrollLeft;
    setScrollPosition(position);
  };
  const [adsData] = useState(AdsTableData);
  const [avgBasketRange, setAvgBasketRange] = useState({ min: '', max: '' });

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
    const cont = document.querySelector('#adsContainer');
    cont.addEventListener('scroll', handleScroll);
    return () => {
      cont.removeEventListener('scroll', handleScroll);
    };
  }, [ads]);

  useEffect(() => {
    const preHead = adsData.reduce(
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
  }, [JSON.stringify(adsData)]);

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

  const getAdsTable = () => {
    if (isLoadingAds) {
      return <PlanningOffersTableEmpty />;
    }

    return <PlanningOffersTable type="ad" rows={ads} />;
  };

  return (
    <div className="wrapper marketing-wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
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
              className={`right-part-header_link ${scrollPosition > 200 ? 'active' : ''}`}
              variant="div"
            >
              <HashLink to="#vendor_name">
                <BoxKit className={scrollPosition < 200 ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Ads Management
                </BoxKit>
              </HashLink>
              <HashLink to="#return_on_ad_spent">
                <BoxKit className={scrollPosition > 200 ? 'active' : ''}>
                  <img src={OffersPerformenceIcon} alt="Offer Performence icon" />
                  Ads Performance
                </BoxKit>
              </HashLink>
            </TypographyKit>
          </div>
        </div>
        {/* <TypographyKit variant="div" className="marketing-paper-top-btns">
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
          <ButtonKit className="marketing-delete" variant="outlined">
            <img src={TrashIcon} alt="Trash Icon" />
            Delete Offer
          </ButtonKit>
        </TypographyKit> */}
        {getAdsTable()}
        {/* <MarketingTable selected={selected} rows={adsDataFiltered} /> */}
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
      <div
        role="presentation"
        tabIndex={-1}
        onClick={() => CloseFilterPopup(true)}
        className={`filter-overlay${openedFilter ? ' active' : ''}`}
      >
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
            }}
          >
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
                  }}
                >
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
            }}
          >
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
                  }}
                >
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
            }}
          >
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
                  }}
                >
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
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
                  }}
                >
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
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
                }}
              >
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
                }}
              >
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
              onClick={() => CloseFilterPopup(false)}
            >
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

export default MarketingAds;
