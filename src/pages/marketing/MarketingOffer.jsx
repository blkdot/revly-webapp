import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
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
  const [links, setLinks] = useState('managment');
  const { vendors, vendorsPlatform } = useVendors();
  const { dateFromContext: dateFrom } = useDate();
  const [dateFromBtn, setDateFromBtn] = useState({
    startDate: dateFrom.startDate,
    endDate: dateFrom.endDate,
  });
  return (
    <div className="wrapper">
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
      <PaperKit className="marketing-paper">
        <div className="right-part">
          <div className="right-part-header marketing-links">
            <TypographyKit
              className={`right-part-header_link ${links === 'performence' ? 'active' : ''}`}
              variant="div">
              <HashLink to="#dateMn">
                <BoxKit
                  className={links === 'managment' ? 'active' : ''}
                  onClick={() => setLinks('managment')}>
                  <img src={OffersManagmentIcon} alt="Offers managment icon" />
                  Offers Managment
                </BoxKit>
              </HashLink>
              <HashLink to="#revenuePr">
                <BoxKit
                  className={links === 'performence' ? 'active' : ''}
                  onClick={() => setLinks('performence')}>
                  <img src={OffersPerformenceIcon} alt="Offer Performence icon" />
                  Offers Performence
                </BoxKit>
              </HashLink>
            </TypographyKit>
          </div>
        </div>
        <TypographyKit variant="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="marketing-filters">
            <div>
              {['Filter One', 'Filter Two', 'Filter Three'].map((name) => (
                <ButtonKit key={name} variant="outlined">
                  <img src={FilterIcon} alt="Filter Icon" />
                  {name}
                </ButtonKit>
              ))}
            </div>
            <ButtonKit variant="outlined">
              <img src={plus} alt="Filter Icon" />
              More Filter
            </ButtonKit>
          </div>
          <ButtonKit className="marketing-delete" variant="outlined">
            <img src={TrashIcon} alt="Trash Icon" />
            Delete Offer
          </ButtonKit>
        </TypographyKit>
        <MarketingTable type={links} rows={OffersTableData} />
      </PaperKit>
      <MarketingSetup active={active} setActive={setActive} />
    </div>
  );
};

export default MarketingOffer;
