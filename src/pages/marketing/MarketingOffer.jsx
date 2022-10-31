import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { pascalCase } from 'change-case';

import './Marketing.scss';

import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import MarketingSetup from '../../components/marketingSetup/MarketingSetup';
import MarketingTable from '../../components/marketingTable/MarketingTable';
import FilterDropdown from '../../components/filter/filterDropdown/FilterDropdown';
import MarketingOfferFilter from '../../components/marketingOfferFilter/MarketingOfferFilter';
import MarketingOfferRemove from '../../components/marketingOfferRemove/MarketingOfferRemove';

import { platformObject } from '../../data/platformList';

import TypographyKit from '../../kits/typography/TypographyKit';
import BoxKit from '../../kits/box/BoxKit';
import PaperKit from '../../kits/paper/PaperKit';
import ButtonKit from '../../kits/button/ButtonKit';

import usePlanningOffers from '../../hooks/usePlanningOffers';

import OffersPerformenceIcon from '../../assets/images/ic_offers-pr.png';
import OffersManagmentIcon from '../../assets/images/ic_offers-mn.png';
import SmartRuleBtnIcon from '../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../assets/images/ic_setting-future.png';
import Layers from '../../assets/icons/Layers';
import Tag from '../../assets/icons/Tag';
import Vector from '../../assets/icons/Vector';

import { fomatOffers, defaultFilterStateFormat } from './marketingOfferData';
import useVendors from '../../hooks/useVendors';
import useDate from '../../hooks/useDate';

const MarketingOffer = () => {
  const [active, setActive] = useState(false);
  const { date: dateContext } = useDate();
  const { vendors } = useVendors();
  const { vendorsArr, vendorsPlatform, restaurants } = vendors;
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: dateContext.beforePeriod.startDate,
    endDate: dateContext.beforePeriod.endDate,
  });
  const { offers } = usePlanningOffers({ dateRange: beforePeriodBtn });

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

  const [filters, setFilters] = useState(defaultFilterStateFormat);

  const [filtersHead, setFiltersHead] = useState(defaultFilterStateFormat);

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
        <RestaurantDropdown
          restaurants={restaurants}
          vendors={vendorsArr}
          vendorsPlatform={vendorsPlatform}
        />
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
              onClick={() => setOpenedFilter(true)}
            >
              <Vector />
              More Filters
            </ButtonKit>
          </div>
        </TypographyKit>
        <MarketingTable selected={selected} rows={offersDataFiltered} offers={offers} />
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
