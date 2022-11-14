import React from 'react';

import './MenuDropdown.scss';

import FormcontrolKit from '../../../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../../../kits/inputlabel/InputLabelKit';
import SelectKit from '../../../../kits/select/SelectKit';

const MenuDropdown = (props) => {
  const {
    label,
    items,
    startIcon,
    onChange,
    renderOption,
    renderValue,
    multiple,
    value,
    defaultValue,
  } = props;

  const renderSelectItem = (arr) => arr?.map((v) => renderOption(v));

  return (
    <FormcontrolKit fullWidth>
      <InputLabelKit>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {startIcon}
          {label}
        </div>
      </InputLabelKit>
      <SelectKit
        renderValue={renderValue}
        multiple={multiple}
        value={value}
        defaultValue={defaultValue}
        sx={{ height: '55px' }}
        onChange={onChange}
        label={label}
      >
        {renderSelectItem(items)}
      </SelectKit>
    </FormcontrolKit>
  );
};

export default MenuDropdown;
