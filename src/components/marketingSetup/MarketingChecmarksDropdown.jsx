import * as React from 'react';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import SelectKit from '../../kits/select/SelectKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import RestaurantCheckboxAccordion from '../restaurantDropdown/RestaurantCheckboxAccardion';

const MarketingCheckmarksDropdown = ({
  personName,
  setName,
  names,
  title,
  icon,
  width,
  type,
  height,
}) => {
  const ITEM_HEIGHT = height || 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: width || 250,
      },
    },
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (type === 'vendor') {
      if (value.length > 0) {
        setName({
          ...personName,
          vendorsSelected: typeof value === 'string' ? value.split(',') : value,
        });
      }
    } else {
      setName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    }
  };
  const { chainObj, display, vendorsObj } = type === 'vendor' ? personName : {};
  const handleChangeChain = (value, checked) => {
    const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
    const chainObjClear = JSON.parse(JSON.stringify(chainObj));
    Object.keys(chainObjClear).forEach((cName) => {
      if (Object.keys(chainObjClear[cName]).length === 0) {
        delete chainObjClear[cName];
      }
    });
    if (Object.keys(chainObjClear).length > 1) {
      if (!checked) {
        Object.keys(chainObj[value]).forEach((vName) => {
          Object.keys(chainObjTemp[value][vName]).forEach((platform) => {
            vendorsObj[platform]?.forEach((obj, index) => {
              if (+obj.chain_id === chainObjTemp[value][vName][platform].chain_id) {
                vendorsObj[platform].splice(index, 1);
              }
            });
          });
          delete chainObjTemp[value][vName];
        });
        setName({
          ...personName,
          chainObj: chainObjTemp,
          vendorsObj,
        });
      }
    }
    if (checked) {
      Object.keys(display).forEach((cName) => {
        if (cName === value) {
          Object.keys(display[value]).forEach((n) => {
            Object.keys(display[value][n]).forEach((platform) => {
              if (!vendorsObj[platform]) {
                vendorsObj[platform] = [display[value][n][platform]];
              } else {
                vendorsObj[platform]?.push(display[value][n][platform]);
              }
            });
          });
          chainObjTemp[value] = display[value];
        }
      });

      setName({
        ...personName,
        chainObj: chainObjTemp,
        vendorsObj,
      });
    }
  };
  const handleChangeVendor = (event, chainName) => {
    const {
      target: { value, checked },
    } = event;
    const chainObjClear = JSON.parse(JSON.stringify(chainObj));
    Object.keys(chainObjClear).forEach((cName) => {
      if (Object.keys(chainObjClear[cName]).length === 0) {
        delete chainObjClear[cName];
      }
    });
    if (
      Object.keys(chainObjClear).length > 1 ||
      Object.keys(chainObjClear[chainName] || {}).length > 1
    ) {
      if (!checked) {
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
        const vendorsObjTemp = JSON.parse(JSON.stringify(vendorsObj));
        Object?.keys(chainObjTemp?.[chainName]?.[value])?.forEach((platform) => {
          vendorsObjTemp[platform]?.forEach((obj, index) => {
            if (+obj.chain_id === chainObjTemp[chainName][value][platform].chain_id) {
              vendorsObjTemp[platform].splice(index, 1);
            }
          });
        });
        delete chainObjTemp[chainName][value];
        Object.keys(vendorsObjTemp).forEach((p) => {
          if (vendorsObjTemp[p].length === 0) {
            delete vendorsObjTemp[p];
          }
        });
        setName({
          ...personName,
          chainObj: chainObjTemp,
          vendorsObj: vendorsObjTemp,
        });
      }
    }
    if (checked) {
      const chainObjTemp = {
        ...chainObj,
        [chainName]: { ...chainObj[chainName], [value]: { ...display[chainName][value] } },
      };
      const vendorsObjTemp = { ...vendorsObj };
      Object.keys(display[chainName][value]).forEach((p) => {
        if (vendorsObjTemp[p]) {
          vendorsObjTemp[p] = [...vendorsObjTemp[p], display[chainName][value][p]];
        } else {
          vendorsObjTemp[p] = [display[chainName][value][p]];
        }
      });
      setName({
        ...personName,
        chainObj: chainObjTemp,
        vendorsObj: vendorsObjTemp,
      });
    }
  };
  const renderLoayaut = () => {
    if (Object.keys(personName.display).length > 0 && type === 'vendor') {
      return (
        <div className="dropdown-paper cost">
          {Object.keys(personName.display).map((el, index) => (
            <RestaurantCheckboxAccordion
              key={el}
              handleChange={handleChangeChain}
              info={personName.display[el]}
              chainName={el}
              handleChangeVendor={handleChangeVendor}
              chainObj={personName.chainObj}
              index={index}
              setVendors={setName}
              vendors={personName}
              display={personName.display}
              listing
            />
          ))}
        </div>
      );
    }
    return names.map((name) => (
      <MenuItemKit
        className={type === 'vendor' ? 'listing-vendors-child' : ''}
        key={name}
        value={name}
      >
        <CheckboxKit
          checked={(type === 'vendor' ? personName.vendorsSelected : personName).indexOf(name) > -1}
        />
        <ListItemTextKit primary={name} />
      </MenuItemKit>
    ));
  };
  return (
    <div style={{ width: '100%' }}>
      <FormcontrolKit
        className="top-competition marketing-setup-dropdown"
        sx={{ m: 1, width: 300 }}
      >
        <InputLabelKit
          className="competition-dropdown restaurant-dropdown-input"
          id="demo-multiple-checkbox-label"
        >
          {icon ? <img src={icon} alt="Select Icon" /> : ''}
          {title || 'Customised Days'}
        </InputLabelKit>
        <SelectKit
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={type === 'vendor' ? personName.vendorsSelected : personName}
          onChange={handleChange}
          input={<OutlindeInputKit uncontrolled label={title || 'Customised Days'} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {renderLoayaut()}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};
export default MarketingCheckmarksDropdown;
