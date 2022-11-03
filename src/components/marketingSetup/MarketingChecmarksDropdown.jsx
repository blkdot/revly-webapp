import * as React from 'react';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import SelectKit from '../../kits/select/SelectKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';

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

const MarketingCheckmarksDropdown = ({ personName, setName, names }) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <FormcontrolKit
        className="top-competition marketing-setup-dropdown"
        sx={{ m: 1, width: 300 }}
      >
        <InputLabelKit id="demo-multiple-checkbox-label">Customised Days</InputLabelKit>
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlindeInputKit uncontrolled label="Customised Days" />}
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
};
export default MarketingCheckmarksDropdown;
