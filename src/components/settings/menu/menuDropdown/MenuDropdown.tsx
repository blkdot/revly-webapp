import { FormControlKit, InputLabelKit, SelectKit } from 'kits';

const MenuDropdown = (props: any) => {
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
    <FormControlKit fullWidth>
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
    </FormControlKit>
  );
};

export default MenuDropdown;
