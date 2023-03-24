import { FormControlKit, SelectKit } from 'kits';

import './MenuDropdown.scss';

const MenuDropdown = (props: any) => {
  const { items, onChange, renderOption, renderValue, multiple, value, defaultValue, placeholder } =
    props;

  const renderSelectItem = (arr) => arr?.map((v) => renderOption(v));

  return (
    <FormControlKit className='menu-dropdown__form-control' fullWidth>
      {!value.length && <span className='menu-dropdown__placeholder'>{placeholder}</span>}
      <SelectKit
        renderValue={value.length ? renderValue : placeholder}
        multiple={multiple}
        value={value}
        defaultValue={defaultValue}
        sx={{ height: '55px' }}
        onChange={onChange}
      >
        <div className='ant-popover-arrow' />
        {renderSelectItem(items)}
      </SelectKit>
    </FormControlKit>
  );
};

export default MenuDropdown;
