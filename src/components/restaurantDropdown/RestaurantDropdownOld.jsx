import * as React from 'react';

import './RestaurantDropdown.scss';

import SelectKit from '../../kits/select/SelectKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import talabat from '../../assets/images/talabat-favicon.png';
import deliveroo from '../../assets/images/deliveroo-favicon.webp';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import useVendors from '../../hooks/useVendors';
import useDate from '../../hooks/useDate';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    id: 'restaurant_dropdown_menu',
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
      left: 0,
    },
  },
};

const RestaurantDropdownOld = ({
  vendors,
  vendorsPlatform,
  restaurants,
  state,
  setState,
  cost,
}) => {
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const platforms = vendorsPlatform.reduce((a, v) => ({ ...a, [v]: [] }), {});

    if (value.length > 0) {
      value.forEach((el) => {
        vendors.forEach((e) => {
          if (el === e.data.vendor_name) {
            platforms[e.platform].push(e);
          }
        });
      });
      if (cost) {
        const newValue = {
          ...state,
          vendorsObj: platforms,
          restaurants: typeof value === 'string' ? value.split(',') : value,
        };

        setState(newValue);
      } else {
        const newValue = {
          ...vendorsContext,
          vendorsObj: platforms,
          restaurants: typeof value === 'string' ? value.split(',') : value,
        };

        setVendors(newValue);
        localStorage.setItem('vendors', JSON.stringify(newValue));
      }
    }
  };

  return (
    <div className="restaurant-dropdown_wrapper old">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <FormcontrolKit sx={{ m: 1, width: 300 }}>
        <img
          style={{ position: 'absolute' }}
          className="select_icon"
          src={selectIcon}
          alt="Select Icon"
        />
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={restaurants}
          onChange={handleChange}
          input={<OutlindeInputKit />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          sx={{ textTransform: 'capitalize', paddingLeft: '25px', paddingRight: '0px' }}
        >
          {vendors?.map((info) => (
            <MenuItemKit key={info.vendor_id} value={info.data.vendor_name}>
              <CheckboxKit checked={restaurants.indexOf(info.data.vendor_name) > -1} />
              <img
                className="restaurant-img"
                src={info.platform === 'talabat' ? talabat : deliveroo}
                alt={info.platform}
              />
              <ListItemTextKit
                sx={{ textTransform: 'capitalize' }}
                primary={info.data.vendor_name}
              />
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default RestaurantDropdownOld;
