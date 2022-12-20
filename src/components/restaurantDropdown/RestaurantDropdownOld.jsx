import * as React from 'react';

import './RestaurantDropdown.scss';

import SelectKit from '../../kits/select/SelectKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import talabat from '../../assets/images/talabat-favicon.png';
import deliveroo from '../../assets/images/deliveroo-favicon.webp';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import useVendors from '../../hooks/useVendors';
import useDate from '../../hooks/useDate';
import ButtonKit from '../../kits/button/ButtonKit';
import TooltipKit from '../../kits/toolTip/TooltipKit';
import { platformList } from '../../data/platformList';

const ITEM_HEIGHT = 110;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    id: 'restaurant_dropdown_menu',
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 520,
      left: 0,
    },
  },
};

const RestaurantDropdownOld = ({ vendors, restaurants, state, setState, cost }) => {
  const { setVendors, vendors: vendorsContext } = useDate();
  const { vendors: vendorsReq } = useVendors();
  React.useEffect(() => {
    window.onbeforeunload = (e) => {
      localStorage.setItem('leaveTime', JSON.stringify(new Date()));
      e.target.hidden = true;
      return '';
    };
    if (vendorsReq.vendorsArr.length > 0) {
      setVendors(vendorsReq);
    }
  }, [JSON.stringify(vendorsReq)]);

  const handleChange = (value) => {
    const restaurantsTemp = JSON.parse(JSON.stringify(restaurants));
    if (restaurants.some((vName) => vName === value) && restaurants.length > 1) {
      restaurantsTemp.splice(
        restaurants.findIndex((vName) => vName === value),
        1,
      );
    } else if (!restaurants.some((vName) => vName === value)) {
      restaurantsTemp.push(value);
    }
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    restaurantsTemp.forEach((vName) => {
      platformList.forEach((p) => {
        vendors.forEach((obj) => {
          if (obj.data.vendor_name === vName && obj.platform === p.name) {
            vendorsObjTemp[p.name] = [...vendorsObjTemp[p.name], obj];
          }
        });
      });
    });
    Object.keys(vendorsObjTemp).forEach((p) => {
      if (vendorsObjTemp[p].length === 0) {
        delete vendorsObjTemp[p];
      }
    });
    if (restaurants.length > 1 || restaurantsTemp.length > 1) {
      if (cost) {
        const newValue = {
          ...state,
          vendorsObj: vendorsObjTemp,
          restaurants: restaurantsTemp,
        };

        setState(newValue);
      } else {
        const newValue = {
          ...vendorsContext,
          vendorsObj: vendorsObjTemp,
          restaurants: restaurantsTemp,
        };

        setVendors(newValue);
      }
    }
  };
  const handleClick = (e, index) => {
    e.stopPropagation();
    const vendorsObjTemp = { [vendors[index].platform]: [vendors[index]] };
    const restaurantsTemp = [vendors[index].data.vendor_name];
    if (cost) {
      setState({
        ...state,
        vendorsObj: vendorsObjTemp,
        restaurants: restaurantsTemp,
      });
    } else {
      setVendors({
        ...vendorsContext,
        vendorsObj: vendorsObjTemp,
        restaurants: restaurantsTemp,
      });
    }
  };
  const selectAll = () => {
    const restaurantsTemp = vendors.map((obj) => obj.data.vendor_name);
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    vendors.forEach((obj) => {
      vendorsObjTemp[obj.platform] = [...vendorsObjTemp[obj.platform], obj];
    });
    if (cost) {
      setState({ ...state, restaurants: restaurantsTemp, vendorsObj: vendorsObjTemp });
    } else {
      setVendors({ ...vendorsContext, restaurants: restaurantsTemp, vendorsObj: vendorsObjTemp });
    }
  };
  const compareSize = () => {
    const textElement = document.querySelectorAll('.restaurant-vendors');
    const compareArr = [];
    textElement.forEach((el) => {
      if (el?.scrollWidth > el?.clientWidth) {
        compareArr.push(el?.textContent);
      }
    });
    setHover(compareArr);
  };
  const root = document.querySelector('#root');
  React.useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [root.ariaHidden]);

  React.useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [root.ariaHidden],
  );

  const [hoverStatus, setHover] = React.useState([]);
  const getHoverStatusVendor = (vName) => hoverStatus.find((v) => v === vName);
  const renderLayout = (info, index) => (
    <div className="vendors-only" key={info.vendor_id}>
      <MenuItemKit onClick={() => handleChange(info.data.vendor_name)}>
        <CheckboxKit checked={restaurants.indexOf(info.data.vendor_name) > -1} />
        <img
          className="restaurant-img"
          src={info.platform === 'talabat' ? talabat : deliveroo}
          alt={info.platform}
        />
        <TooltipKit
          onClick={(e) => e.stopPropagation()}
          interactive={1}
          disableHoverListener={!getHoverStatusVendor(info.data.vendor_name)}
          id="category-tooltip"
          title={info.data.vendor_name}
        >
          <div className="restaurant-vendors">{info.data.vendor_name}</div>
        </TooltipKit>
        <div
          role="presentation"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="only-button"
        >
          <ButtonKit onClick={(e) => handleClick(e, index)} variant="contained">
            Only
          </ButtonKit>
        </div>
      </MenuItemKit>
    </div>
  );

  return (
    <div className="restaurant-dropdown_wrapper old">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <FormcontrolKit sx={{ m: 1, width: 300 }}>
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={restaurants}
          input={<OutlindeInputKit />}
          renderValue={(selected) => (
            <div style={{ display: 'flex', alignItems: 'center', width: '90%', gridGap: '10px' }}>
              <img className="select_icon" src={selectIcon} alt="Select Icon" />
              <span
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '90%',
                }}
              >
                {selected.join(', ')}
              </span>
            </div>
          )}
          MenuProps={MenuProps}
          sx={{ textTransform: 'capitalize', paddingLeft: '25px', paddingRight: '0px' }}
        >
          <div className="dropdown-paper">
            <div className="selected-chains">
              <p>Selected: {(cost ? state.restaurants : restaurants).length}</p>
              <ButtonKit
                disabled={vendors.length === (cost ? state.restaurants : restaurants).length}
                onClick={selectAll}
                variant="contained"
              >
                Select All
              </ButtonKit>
            </div>
            {vendors?.map((info, index) => renderLayout(info, index))}
          </div>
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default RestaurantDropdownOld;
