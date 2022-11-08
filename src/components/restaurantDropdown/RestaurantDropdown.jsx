import * as React from 'react';

import './RestaurantDropdown.scss';

import SelectKit from '../../kits/select/SelectKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import useDate from '../../hooks/useDate';
import talabat from '../../assets/images/talabat-favicon.png';
import deliveroo from '../../assets/images/deliveroo-favicon.webp';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
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

const RestaurantDropdown = ({ vendors, vendorsPlatform, restaurants }) => {
  const { setVendors, vendors: vendorsContext } = useDate();

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
      setVendors({
        ...vendorsContext,
        vendorsObj: platforms,
        restaurants: typeof value === 'string' ? value.split(',') : value,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          vendorsObj: platforms,
          restaurants: typeof value === 'string' ? value.split(',') : value,
        }),
      );
    }
  };

  return (
    <div className="restaurant-dropdown_wrapper">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <FormcontrolKit sx={{ m: 1, width: 300 }}>
        <img className="select_icon" src={selectIcon} alt="Select Icon" />
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={restaurants}
          onChange={handleChange}
          input={<OutlindeInputKit />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          sx={{ textTransform: 'capitalize' }}
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

export default RestaurantDropdown;
