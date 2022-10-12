import * as React from 'react';
import './CompetitionDropdown.scss';
import SelectKit from '../../kits/select/SelectKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import UAE from '../../assets/images/UAE.png';
import Kuwait from '../../assets/images/Kuwait.png';
import Qatar from '../../assets/images/Qatar.png';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CompetitionDropdown = ({ className, title, rows, select, icon, setRow }) => {
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

  const getFlag = (name) => {
    if (name === 'UAE') {
      return UAE;
    }
    if (name === 'Kuwait') {
      return Kuwait;
    }
    return Qatar;
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
          renderValue={(selected) => (
            <div className="country-wrapper">
              {title === 'Country' ? (
                <img className="flag-img" src={getFlag(selected)} alt={selected} />
              ) : (
                ''
              )}
              {selected}
            </div>
          )}
          MenuProps={MenuProps}>
          {rows?.map((name) => (
            <MenuItemKit key={name} value={name}>
              {title === 'Country' ? (
                <img className="flag-img" src={getFlag(name)} alt={name} />
              ) : (
                ''
              )}
              <ListItemTextKit primary={name} />
            </MenuItemKit>
          ))}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default CompetitionDropdown;
