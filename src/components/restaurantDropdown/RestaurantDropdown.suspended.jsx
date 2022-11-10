import React, { useState } from 'react';

import './RestaurantDropdown.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDate from '../../hooks/useDate';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';

const RestaurantDropdown = () => {
  onbeforeunload = () => {
    localStorage.removeItem('vendors');
    return '';
  };
  const { setVendors, vendors: vendorsContext } = useDate();
  const { vendorsObj, display, chainObj } = vendorsContext;
  const [active, setActive] = useState(false);
  const handleChange = (event) => {
    const {
      target: { value, checked },
    } = event;
    if (Object.keys(chainObj).length > 1) {
      if (!checked) {
        Object.keys(chainObj[value]).forEach((n) => {
          chainObj[value][n].checked = false;
          Object.keys(chainObj[value][n]).forEach((platform) => {
            vendorsObj[platform]?.forEach((obj, index) => {
              if (+obj.chain_id === chainObj[value][n][platform].chain_id) {
                vendorsObj[platform].splice(index, 1);
              }
            });
          });
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
        return;
      }
    }
    if (checked) {
      Object.keys(chainObj[value]).forEach((n) => {
        chainObj[value][n].checked = true;
        Object.keys(chainObj[value][n]).forEach((platform) => {
          vendorsObj[platform]?.splice(0, 0, chainObj[value][n][platform]);
        });
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
      target: { value, checked },
    } = event;
    if (Object.keys(chainObj[chainName]).length > 0) {
      if (!checked) {
        chainObj[chainName][value].checked = false;
        Object.keys(chainObj[chainName][value]).forEach((platform) => {
          vendorsObj[platform]?.forEach((obj, index) => {
            if (+obj.chain_id === chainObj[chainName][value][platform].chain_id) {
              vendorsObj[platform].splice(index, 1);
            }
          });
        });
        setVendors({
          ...vendorsContext,
          chainObj,
          vendorsObj,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            chainObj,
            vendorsObj,
          }),
        );
        return;
      }
    }
    if (checked) {
      chainObj[chainName][value].checked = true;
      Object.keys(chainObj[chainName][value]).forEach((platform) => {
        vendorsObj[platform]?.splice(0, 0, chainObj[chainName][value][platform]);
      });
      setVendors({
        ...vendorsContext,
        chainObj,
        vendorsObj,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          chainObj,
          vendorsObj,
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
  const getChain = () => {
    const obj = {};
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((n) => {
        if (chainObj[chainName][n].checked) {
          obj[chainName] = {};
        }
      });
    });
    return Object.keys(obj);
  };
  return (
    <div className="restaurant-dropdown_wrapper">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <div tabIndex={-1} role="presentation" onClick={handleClick} style={{ width: 300 }}>
        <img className="select_icon" src={selectIcon} alt="Select Icon" />
        <TypographyKit className="restaurants-selected" variant="div">
          <div>{getChain().join(', ')}</div>
        </TypographyKit>
        <ExpandMoreIcon />
      </div>
      <div
        tabIndex={-1}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={`dropdown-paper ${active ? 'active' : ''}`}
      >
        {Object.keys(display).map((el) => (
          <RestaurantCheckboxAccordion
            key={el}
            handleChange={handleChange}
            info={display[el]}
            chainName={el}
            chainArr={Object.keys(chainObj)}
            handleChangeVendor={handleChangeVendor}
            chainObj={chainObj}
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
