import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
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
import FilterIcon from '../../assets/images/ic_filter.png';
import TrashIcon from '../../assets/images/ic_trash.png';
import plus from '../../assets/images/plus.png';
import MarketingTable from '../../components/marketingTable/MarketingTable';
import { OffersTableData } from '../../data/fakeDataMarketing';

const MarketingOffer = () => {
  const [active, setActive] = useState(false);
  const { vendors, vendorsPlatform } = useVendors();
  const { dateFromContext: dateFrom } = useDate();
  const [dateFromBtn, setDateFromBtn] = useState({
    startDate: dateFrom.startDate,
    endDate: dateFrom.endDate,
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selected, setSelected] = useState([]);
  const [opened, setOpened] = useState(false);
  const [openedFilter, setOpenedFilter] = useState(false);
  const [row, setRow] = useState(OffersTableData);
  const handleScroll = () => {
    const cont = document.querySelector('#markeitngContainer');
    const position = cont.scrollLeft;
    setScrollPosition(position);
  };
  useEffect(() => {
    const cont = document.querySelector('#markeitngContainer');
    cont.addEventListener('scroll', handleScroll);
    return () => {
      cont.removeEventListener('scroll', handleScroll);
    };
  }, []);
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
  const OpenFilterPopup = () => {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    setOpenedFilter(true);
  };
  const CloseFilterPopup = () => {
    const body = document.querySelector('body');
    body.style.overflow = 'visible';
    setOpenedFilter(false);
  };
  return (
    <div className="wrapper marketing-wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates dateFromBtn={dateFromBtn} setdateFromBtn={setDateFromBtn} />
      </div>
      <div className="marketing-top">
        <div className="marketing-top-text">
          <TypographyKit variant="h4">Marketing - Offers</TypographyKit>
          <TypographyKit color="#637381" variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id.
          </TypographyKit>
        </div>
        <div className="markting-top-btns">
          <ButtonKit className="sm-rule-btn" variant="outlined">
            <img src={SmartRuleBtnIcon} alt="Smart rule icon" />
            Create a smart rule
          </ButtonKit>
          <ButtonKit onClick={() => setActive(true)} variant="contained">
            <img src={SettingFuture} alt="Setting future icon" />
            Set up an offer
          </ButtonKit>
        </div>
      </div>
      <PaperKit className="marketing-paper offer-paper">
        <div className="right-part">
          <div className="right-part-header marketing-links">
            <TypographyKit
              className={`right-part-header_link ${scrollPosition > 578 ? 'active' : ''}`}
              variant="div">
              <HashLink to="#dateMn">
                <BoxKit className={scrollPosition < 578 ? 'active' : ''}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Offers Managment
                </BoxKit>
              </HashLink>
              <HashLink to="#revenuePr">
                <BoxKit className={scrollPosition > 578 ? 'active' : ''}>
                  <img src={OffersPerformenceIcon} alt="Offer Performence icon" />
                  Offers Performence
                </BoxKit>
              </HashLink>
            </TypographyKit>
          </div>
        </div>
        <TypographyKit variant="div" className="marketing-paper-top-btns">
          <div className="marketing-filters">
            <div>
              {['Filter One', 'Filter Two', 'Filter Three'].map((name) => (
                <ButtonKit key={name} variant="outlined">
                  <img src={FilterIcon} alt="Filter Icon" />
                  {name}
                </ButtonKit>
              ))}
            </div>
            <div>
              <ButtonKit onClick={() => OpenFilterPopup()} variant="outlined">
                <img src={plus} alt="Filter Icon" />
                More Filter
              </ButtonKit>
              <ButtonKit
                onClick={() => (selected.length > 0 ? setOpened(true) : setOpened(false))}
                className={`marketing-delete ${selected.length > 0 ? 'selected' : ''}`}
                variant="outlined">
                <img src={TrashIcon} alt="Trash Icon" />
                Cancel Offer
              </ButtonKit>
            </div>
          </div>
        </TypographyKit>
        <MarketingTable selected={selected} setSelected={setSelected} rows={row} />
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
        onClick={() => CloseFilterPopup()}
        className={`filter-overlay${openedFilter ? ' active' : ''}`}>
        <PaperKit onClick={(e) => e.stopPropagation()} className="marketing-paper filter-paper">
          <div>
            <TypographyKit>More Filters</TypographyKit>
            <img
              role="presentation"
              tabIndex={-1}
              onClick={() => CloseFilterPopup()}
              src={CloseIcon}
              alt="close icon"
            />
          </div>
          <TypographyKit variant="subtitle">
            Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
            vivamus risus.
          </TypographyKit>
          <div>
            <ButtonKit variant="contained">Confirme and Filter</ButtonKit>
            <ButtonKit variant="outlined" onClick={() => CloseFilterPopup()}>
              Cancel
            </ButtonKit>
          </div>
        </PaperKit>
      </div>
    </div>
  );
};

export default MarketingOffer;
