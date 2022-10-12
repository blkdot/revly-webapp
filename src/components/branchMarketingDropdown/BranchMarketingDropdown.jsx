import * as React from 'react';

import SelectKit from '../../kits/select/SelectKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const BranchMarketingDropdown = ({
  className,
  title,
  rows,
  select,
  icon,
  setRow,
  platformData,
}) => {
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRow(value);
  };

  return (
    <div className={`restaurant-dropdown_wrapper ${className}`}>
      <FormcontrolKit sx={{ m: 1, width: 250 }}>
        <InputLabelKit
          className="restaurant-dropdown-input competition-dropdown"
          id="demo-multiple-checkbox-label">
          {icon ? <img src={icon} alt="Select Icon" /> : ''}
          {title}
        </InputLabelKit>
        <SelectKit
          required
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={select === undefined ? '' : select}
          onChange={handleChange}
          input={<OutlindeInputKit label={title} />}
          renderValue={(selected) => selected}
          MenuProps={MenuProps}>
          {rows?.map((info) => (
            <MenuItemKit key={info.vendor_id} value={info.data.vendor_name}>
              <CheckboxKit checked={select === info.data.vendor_name} />
              <img className="restaurant-img" src={platformData.src} alt={info.platform} />
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

export default BranchMarketingDropdown;
