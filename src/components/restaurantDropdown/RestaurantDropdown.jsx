import * as React from 'react';
import StoreIcon from '@mui/icons-material/Store';

import "./RestaurantDropdown.scss"

import SelectKit from '../../kits/select/SelectKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit'
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function RestaurantDropdown({names}) {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div className="restaurant-dropdown_wrapper">
      <FormcontrolKit sx={{ m: 1, width: 300 }}>
        <InputLabelKit className="restaurant-dropdown-input" id="demo-multiple-checkbox-label">
          <StoreIcon sx={{ color: "gray" }} />
          Vendors
        </InputLabelKit>
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlindeInputKit label="__restaurant-dropdown" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItemKit key={name} value={name}>
              <CheckboxKit checked={personName.indexOf(name) > -1} />
              <ListItemTextKit primary={name} />
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
}