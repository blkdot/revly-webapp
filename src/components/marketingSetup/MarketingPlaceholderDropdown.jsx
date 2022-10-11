import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import SelectKit from '../../kits/select/SelectKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MarketingPlaceholderDropdown = ({ setPersonName, personName, title, names }) => {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
  };

  return (
    <div className="marketing-placeholder-dropdown">
      <FormcontrolKit sx={{ m: 1, width: 300, mt: 3 }}>
        <SelectKit
          displayEmpty
          value={personName}
          onChange={handleChange}
          input={<OutlindeInputKit />}
          renderValue={(selected) => <em>{selected || title}</em>}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}>
          {names.map((name) => (
            <MenuItemKit key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default MarketingPlaceholderDropdown;
