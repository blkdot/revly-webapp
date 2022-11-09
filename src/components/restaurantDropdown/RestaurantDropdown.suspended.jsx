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
  // eslint-disable-next-line
  const { vendorsObj, display, chainObj } = vendorsContext
  const [active, setActive] = useState(false);
  // eslint-disable-next-line
  const handleChange = (event, platform) => {
    const {
      // eslint-disable-next-line
      target: { value, checked }
    } = event;
    if (Object.keys(chainObj).length > 1) {
      if (!checked) {
        delete chainObj[value];
        setVendors({
          ...vendorsContext,
          chainObj,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            chainObj,
          }),
        );
        return;
      }
    }
    if (checked) {
      Object.keys(display)
        .filter((n) => n === value)
        .forEach((n) => {
          chainObj[value] = display[n];
        });
      setVendors({
        ...vendorsContext,
        chainObj,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          chainObj,
        }),
      );
    }
  };
  const handleChangeVendor = (event, chainName) => {
    const {
      // eslint-disable-next-line
      target: { value, checked }
    } = event;
    if (Object.keys(chainObj[chainName]).length > 1) {
      if (!checked) {
        delete chainObj[chainName][value];
        setVendors({
          ...vendorsContext,
          chainObj,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            chainObj,
          }),
        );
        return;
      }
    }
    if (checked) {
      Object.keys(display)
        .filter((n) => n === value)
        .forEach((n) => {
          chainObj[chainName][value] = display[n];
        });
      setVendors({
        ...vendorsContext,
        chainObj,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          chainObj,
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
          <div>
            {vendors.map((obj, index) => {
              if (restaurants.find((el) => obj.chain_id === el)) {
                return `${obj.data.chain_name}, `;
              }
              if (index === vendors.length - 1) {
                return obj.data.chain_name;
              }
              return '';
            })}
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
        {Object.keys(vendorsContext.display).map((el) => (
          <RestaurantCheckboxAccordion
            key={el}
            handleChange={handleChange}
            info={vendorsContext.display[el]}
            chainName={el}
            chainArr={Object.keys(chainObj)}
            handleChangeVendor={handleChangeVendor}
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
