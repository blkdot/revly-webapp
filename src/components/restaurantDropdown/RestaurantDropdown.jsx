import React, { useState } from 'react';

import './RestaurantDropdown.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDate from '../../hooks/useDate';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';

const RestaurantDropdown = ({ vendors, restaurants }) => {
  const { setVendors, vendors: vendorsContext } = useDate();
  const [active, setActive] = useState(false);
  const { vendorsObj } = vendorsContext;
  onbeforeunload = function () {
    localStorage.removeItem('vendors');
    return '';
  };
  const handleChangeChain = (event, platform) => {
    const {
      target: { value, checked },
    } = event;
    if (checked) {
      restaurants.splice(
        vendors.findIndex((el) => el.chain_id === value),
        0,
        vendors.find((el) => el.chain_id === value).chain_id,
      );
      restaurants.forEach((el) =>
        vendorsObj[platform].forEach((obj, index) => {
          if (el === obj.chain_id) {
            vendorsObj[platform].splice(
              index,
              0,
              vendors.find((vObj) => vObj.chain_id === value),
            );
          }
        }),
      );
      setVendors({
        ...vendorsContext,
        restaurants,
        vendorsObj,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          restaurants,
          vendorsObj,
        }),
      );
    }
    if (restaurants.length > 1) {
      if (!checked) {
        restaurants.splice(
          restaurants.findIndex((el) => el === value),
          1,
        );
        restaurants.forEach((el) =>
          vendorsObj[platform].forEach((obj, index) => {
            if (el === obj.chain_id) {
              vendorsObj[platform].splice(index, 1);
            }
          }),
        );
        setVendors({
          ...vendorsContext,
          restaurants,
          vendorsObj,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            restaurants,
            vendorsObj,
          }),
        );
      }
    }
  };
  const handleClick = () => {
    const body = document.querySelector('body');
    if (active) {
      body.style.overflowY = 'visible';
      setActive(false);
      return;
    }
    body.style.overflowY = 'hidden';
    setActive(true);
  };
  return (
    <div className="restaurant-dropdown_wrapper">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <div
        className="restaurant-dropdown"
        tabIndex={-1}
        role="presentation"
        onClick={handleClick}
        style={{ width: 300 }}
      >
        <img className="select_icon" src={selectIcon} alt="Select Icon" />
        <TypographyKit className="restaurants-selected" variant="div">
          <div>
            {vendors.map((obj) =>
              restaurants.find((el) => obj.chain_id === el) ? `${obj.data.chain_name}, ` : '',
            )}
          </div>
        </TypographyKit>
        <ExpandMoreIcon />
      </div>
      <div
        tabIndex={-1}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={`dropdown-paper ${active ? 'active' : ''}`}
      >
        {vendors.map((el) => (
          <RestaurantCheckboxAccordion
            key={el.vendor_id}
            vendors={vendors}
            restaurants={restaurants}
            info={el}
            handleChangeChain={handleChangeChain}
          />
        ))}
      </div>
      <div
        tabIndex={-1}
        role="presentation"
        onClick={handleClick}
        className={`dropdown-overlay ${active ? 'active' : ''}`}
      />
    </div>
  );
};

export default RestaurantDropdown;
