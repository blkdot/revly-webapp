import React from 'react';

import './MenuDropdown.scss';

import FormcontrolKit from '../../../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../../../kits/inputlabel/InputLabelKit';
import SelectKit from '../../../../kits/select/SelectKit';
import MenuItemKit from '../../../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../../../kits/listItemtext/ListItemTextKit';

const MenuDropdown = (props) => {
  const { label, items, startIcon, onChange } = props;

  const renderSelectItem = (arr) =>
    arr.map((v) => (
      <MenuItemKit key={v.name} value={v.name}>
        <ListItemTextKit primary={v.label} />
      </MenuItemKit>
    ));

  return (
    <FormcontrolKit fullWidth>
      <InputLabelKit>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {startIcon}
          {label}
        </div>
      </InputLabelKit>
      <SelectKit sx={{ height: '55px' }} onChange={onChange} label={label}>
        {renderSelectItem(items)}
      </SelectKit>
    </FormcontrolKit>
  );
};

export default MenuDropdown;
