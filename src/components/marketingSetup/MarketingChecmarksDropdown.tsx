import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import ListItemTextKit from '../../kits/listItemtext/ListItemTextKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlindeInputKit from '../../kits/outlindeInput/OutlindeInputKit';
import RadioKit from '../../kits/radio/RadioKit';
import SelectKit from '../../kits/select/SelectKit';
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
  platform,
}: any) => {
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
  const { chainObj, display, vendorsArr } = type === 'vendor' ? personName : ({} as any);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (type === 'vendor') {
      setName({
        ...personName,
        vendorsSelected: [value],
        chainObj: { [platform]: [vendorsArr.find((obj) => obj.data.vendor_name === value)] },
      });
    } else {
      setName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
    }
  };
  const handleChangeVendor = (event, chainName) => {
    const {
      target: { value, checked },
    } = event;
    if (checked) {
      setName({
        ...personName,
        chainObj: { [chainName]: { [value]: { ...display[chainName][value] } } },
        vendorsObj: { [platform]: [display[chainName][value][platform]] },
      });
    }
  };
  const renderLoayaut = () => {
    if (Object.keys(personName?.display || {}).length > 0 && type === 'vendor') {
      return (
        <div className='dropdown-paper cost'>
          {Object.keys(display).map((el, index) => (
            <RestaurantCheckboxAccordion
              key={el}
              info={display[el]}
              chainName={el}
              handleChangeVendor={handleChangeVendor}
              chainObj={chainObj}
              index={index}
              setVendors={setName}
              vendors={personName}
              display={display}
              listing
            />
          ))}
        </div>
      );
    }
    const getDisabled = (info) => {
      if (info.metadata.is_active === 'True' || info.metadata.is_active === true) {
        return true;
      }
      return false;
    };
    return names.map((name) => (
      <MenuItemKit
        className={type === 'vendor' ? 'listing-vendors-child' : ''}
        key={name.data.vendor_name}
        value={name}
        disabled={!getDisabled(name)}
      >
        <RadioKit
          checked={
            type === 'vendor'
              ? personName.vendorsSelected
                  .map((obj) => obj?.data?.vendor_name)
                  .indexOf(name?.data?.vendor_name) > -1
              : personName.indexOf(name) > -1
          }
        />
        <ListItemTextKit primary={name.data.vendor_name} />
      </MenuItemKit>
    ));
  };
  const getVendor = () => {
    const arr = [];
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((vendorName) => {
        if (Object.keys(chainObj[chainName][vendorName]).length > 0) {
          arr.push(vendorName);
        }
      });
    });
    return arr;
  };
  const getValue = () => {
    if (type === 'vendor') {
      if (Object.keys(display).length > 0) {
        return getVendor();
      }
      return personName.vendorsSelected;
    }
    return personName;
  };
  const getRenderValue = (selected) => {
    if (type === 'vendor') {
      if (Object.keys(display).length > 0) {
        return getVendor().join(', ');
      }
      return personName.vendorsSelected.map((obj) => obj?.data?.vendor_name).join(', ');
    }
    return selected.join(', ');
  };
  return (
    <div style={{ width: '100%' }}>
      <FormcontrolKit
        className='top-competition marketing-setup-dropdown'
        sx={{ m: 1, width: 300 }}
      >
        <InputLabelKit
          className='competition-dropdown restaurant-dropdown-input'
          id='demo-multiple-checkbox-label'
        >
          {icon ? <img src={icon} alt='Select Icon' /> : ''}
          {title || 'Customised Days'}
        </InputLabelKit>
        <SelectKit
          labelId='demo-multiple-checkbox-label'
          id='demo-multiple-checkbox'
          multiple={type !== 'vendor'}
          value={getValue()}
          onChange={handleChange}
          input={<OutlindeInputKit label={title || 'Customised Days'} />}
          renderValue={(selected) => getRenderValue(selected)}
          MenuProps={MenuProps}
        >
          {renderLoayaut()}
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};
export default MarketingCheckmarksDropdown;
