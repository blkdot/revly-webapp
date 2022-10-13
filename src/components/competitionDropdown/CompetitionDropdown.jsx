import * as React from 'react';
import './CompetitionDropdown.scss';
import SelectKit from '../../kits/select/SelectKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import UAE from '../../assets/images/UAE.png';
import Kuwait from '../../assets/images/Kuwait.png';
import Qatar from '../../assets/images/Qatar.png';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CompetitionDropdown = (props) => {
  const {
    className,
    title,
    rows,
    renderOptions,
    select,
    icon,
    setRow,
    multiple,
    onChange,
    id,
    renderValue,
  } = props;

  const MenuProps = {
    PaperProps: {
      id,
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
    if (setRow) {
      setRow(value);
    }
  };

  const getFlag = (name) => {
    if (name === 'UAE') {
      return UAE;
    }
    if (name === 'Kuwait') {
      return Kuwait;
    }
    return Qatar;
  };

  const renderSelectOption = (arr) =>
    arr?.map((name) =>
      renderOptions ? (
        renderOptions(name)
      ) : (
        <MenuItemKit key={name} value={name}>
          {title === 'Country' ? <img className="flag-img" src={getFlag(name)} alt={name} /> : ''}
          <ListItemTextKit primary={name} />
        </MenuItemKit>
      ),
    );

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
          multiple={multiple}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={select === undefined ? '' : select}
          onChange={onChange || handleChange}
          input={<OutlindeInputKit label={title} />}
          renderValue={(selected) =>
            renderValue ? (
              renderValue(selected)
            ) : (
              <div className="country-wrapper">
                {title === 'Country' && (
                  <img className="flag-img" src={getFlag(selected)} alt={selected} />
                )}
                {selected}
              </div>
            )
          }
          MenuProps={MenuProps}>
          {renderSelectOption(rows)}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default CompetitionDropdown;
