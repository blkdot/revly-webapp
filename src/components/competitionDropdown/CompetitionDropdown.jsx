import * as React from 'react';
import './CompetitionDropdown.scss';
import SelectKit from '../../kits/select/SelectKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CompetitionDropdown = ({ className, title, rows, select, selectWidth }) => {
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: selectWidth,
      },
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.length > 0) {
      // setRestaurants(typeof value === 'string' ? value.split(',') : value);
    }
  };

  return (
    <div className={`restaurant-dropdown_wrapper ${className}`}>
      <FormcontrolKit sx={{ m: 1, width: 300 }}>
        <InputLabelKit className="restaurant-dropdown-input" id="demo-multiple-checkbox-label">
          {title}
        </InputLabelKit>
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={select || []}
          onChange={handleChange}
          input={<OutlindeInputKit label={title} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}>
          {rows?.map((name) => (
            <MenuItemKit key={name} value={name}>
              <CheckboxKit checked={select?.indexOf(name) > -1} />
              <ListItemTextKit primary={name} />
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default CompetitionDropdown;
