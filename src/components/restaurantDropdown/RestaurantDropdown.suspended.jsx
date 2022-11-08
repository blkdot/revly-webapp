import React, { useState } from 'react';

import './RestaurantDropdown.scss';
// import SelectKit from '../../kits/select/SelectKit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDate from '../../hooks/useDate';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';

// import PaperKit from '../../kits/paper/PaperKit';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
// eslint-disable-next-line
const MenuProps = {
  PaperProps: {
    id: 'restaurant_dropdown_menu',
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      left: 0,
    },
  },
};
// eslint-disable-next-line
const RestaurantDropdown = ({ vendors, restaurants }) => {
  // eslint-disable-next-line
  const { setVendors, vendors: vendorsContext } = useDate();
  const [active, setActive] = useState(false);
  const handleChange = (event, platform) => {
    const {
      // eslint-disable-next-line
      target: { value, checked }
    } = event;
    if (restaurants.length > 0) {
      if (!checked) {
        restaurants.splice(
          restaurants.findIndex((el) => el === value),
          1,
        );
        vendorsContext.vendorsObj[platform].splice(
          restaurants.findIndex((el) => el === value),
          1,
        );
        setVendors({
          ...vendorsContext,
          restaurants,
          vendorsObj: vendorsContext.vendorsObj,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            restaurants,
            vendorsObj: vendorsContext.vendorsObj,
          }),
        );
        return;
      }
      restaurants.splice(
        vendors.findIndex((el) => el.data.vendor_name === value),
        0,
        vendors.find((el) => el.data.vendor_name === value).data.vendor_name,
      );
      vendorsContext.vendorsObj[platform].splice(
        vendors.findIndex((el) => el.data.vendor_name === value),
        0,
        vendors.find((el) => el.data.vendor_name === value),
      );
      setVendors({
        ...vendorsContext,
        restaurants,
        vendorsObj: vendorsContext.vendorsObj,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          restaurants,
          vendorsObj: vendorsContext.vendorsObj,
        }),
      );
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
      <div tabIndex={-1} role="presentation" onClick={handleClick} style={{ width: 300 }}>
        <img className="select_icon" src={selectIcon} alt="Select Icon" />
        <TypographyKit className="restaurants-selected" variant="div">
          <div>{restaurants.join(', ')}</div>
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
            handleChange={handleChange}
            restaurants={restaurants}
            info={el}
            platform="deliveroo"
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
