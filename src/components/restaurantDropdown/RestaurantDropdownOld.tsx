import { useAtom } from 'jotai';
import {
  ButtonKit,
  CheckboxKit,
  FormControlKit,
  MenuItemKit,
  OutlinedInputKit,
  SelectKit,
  TooltipKit,
  TypographyKit,
} from 'kits';
import * as React from 'react';
import deliveroo from '../../assets/images/deliveroo-favicon.webp';
import selectIcon from '../../assets/images/ic_select.png';
import talabat from '../../assets/images/talabat-favicon.png';
import { platformList } from '../../data/platformList';
import useVendors from '../../hooks/useVendors';
import { vendorsAtom } from '../../store/vendorsAtom';
import './RestaurantDropdown.scss';

const ITEM_HEIGHT = 110;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    id: 'restaurant_dropdown_menu',
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 520,
      left: 0,
    },
  },
};

const RestaurantDropdownOld = ({
  vendors,
  vendorsSelected,
  state,
  setState,
  cost,
  listing,
  branch,
  className,
}: any) => {
  const [vendorsContext, setVendors] = useAtom(vendorsAtom);
  const { vendors: vendorsReq } = useVendors(undefined);
  React.useEffect(() => {
    if(vendorsReq.vendorsArr.length > 1){
      setVendors(vendorsReq)
    }
  }, [vendorsReq])
  
  const handleChange = (value) => {
    const vendorsSelectedTemp = JSON.parse(JSON.stringify(vendorsSelected)); // copy vendorsSelected
    // check if some vendorName equal value and vendorsSelected have at least 1 vendor
    if (
      vendorsSelected.some((obj) => obj.vendor_id === value.vendor_id) &&
      vendorsSelected.length > 1
    ) {
      // deleting vendor from vendorsSelectedTemp
      vendorsSelectedTemp.splice(
        vendorsSelected.findIndex((obj) => obj.vendor_id === value.vendor_id),
        1
      );
    } else if (!vendorsSelected.some((obj) => obj.vendor_id === value.vendor_id)) {
      if (branch) {
        if (vendorsSelected.some((obj) => obj.email === value.email)) {
          vendorsSelectedTemp.push(value);
        } else {
          vendorsSelectedTemp.splice(0, vendorsSelectedTemp.length);
          vendorsSelectedTemp.push(value);
        }
      } else {
        // pushing vendor to vendorsSelectedTemp
        vendorsSelectedTemp.push(value);
      }
    }
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    vendorsSelectedTemp.forEach((objV) => {
      platformList.forEach((p) => {
        vendors.forEach((obj) => {
          // checking if vendor_name and platform from vendorsArr equal vendorName from vendorsSelectedTemp and platform
          if (obj.vendor_id === objV.vendor_id && obj.platform === p.name) {
            // pushing the obj to vendorsObjTemp[p.name (talabat or deliveroo)]
            vendorsObjTemp[p.name].push(obj);
          }
        });
      });
    });
    Object.keys(vendorsObjTemp).forEach((p) => {
      // checing if platform array is empty
      if (vendorsObjTemp[p].length === 0) {
        // if platform array is empty we delete him
        delete vendorsObjTemp[p];
      }
    });
    // checking if vendorsSelected or vendorsSelectedTemp have at least 1 vendor
    if (vendorsSelected.length > 1 || vendorsSelectedTemp.length >= 1) {
      // for own state not for global context
      if (cost || listing || branch) {
        const newValue = {
          ...state,
          vendorsObj: vendorsObjTemp,
          vendorsSelected: vendorsSelectedTemp,
        };

        setState(newValue);
      } else {
        // for global context
        const newValue = {
          ...vendorsContext,
          vendorsObj: vendorsObjTemp,
          vendorsSelected: vendorsSelectedTemp,
        };

        setVendors(newValue);
      }
    }
  };

  // function for button "Only"
  const handleClick = (e, index) => {
    e.stopPropagation();
    const vendorsObjTemp = { [vendors[index].platform]: [vendors[index]] }; // putting only the clicked vendor to vendorsObjTemp
    const vendorsSelectedTemp = [vendors[index].data.vendor_name]; // putting obly the vendor_name vendorsSelectedTemp
    // for own state not for globalcontext
    if (cost) {
      setState({
        ...state,
        vendorsObj: vendorsObjTemp,
        vendorsSelected: vendorsSelectedTemp,
      });
    } else {
      // for global context
      setVendors({
        ...vendorsContext,
        vendorsObj: vendorsObjTemp,
        vendorsSelected: vendorsSelectedTemp,
      });
    }
  };
  // function when click we select all vendors
  const selectAll = () => {
    const vendorsSelectedTemp = vendors.map((obj) => obj.data.vendor_name); // putting all vendor_name to vendorsSelectedTemp
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    // putting all vendor to vendorsObjTemp
    vendors.forEach((obj) => {
      // push the obj of vendorsArr
      vendorsObjTemp[obj.platform].push(obj);
    });
    // for own state not for globalcontext
    if (cost) {
      setState({ ...state, vendorsSelected: vendorsSelectedTemp, vendorsObj: vendorsObjTemp });
    } else {
      // for global context
      setVendors({
        ...vendorsContext,
        vendorsSelected: vendorsSelectedTemp,
        vendorsObj: vendorsObjTemp,
      });
    }
  };
  // function for tooltip
  const compareSize = () => {
    // taking all .tooltip-vendor
    const textElement = document.querySelectorAll('.tooltip-vendor');
    const compareArr = [];
    textElement.forEach((el) => {
      // checking if scrollWidth more than clientWidth (or have 3 dots on the end)
      if (el?.scrollWidth > el?.clientWidth) {
        // if scrollWidth more than clientWidth we push the textContent of this element to compareArr
        compareArr.push(el?.textContent);
      }
    });
    setHover(compareArr);
  };
  const vendorsOld = document.querySelector('#demo-multiple-checkbox-vendors-old');
  React.useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [vendors, vendorsOld?.ariaExpanded]);

  React.useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [vendors, vendorsOld?.ariaExpanded]
  );
  const [hoverStatus, setHover] = React.useState([]);
  const getHoverStatusVendor = (vendorName) => hoverStatus.find((v) => v === vendorName);
  const getDisabled = (info) => {
    if (info.metadata.is_active === 'True' || info.metadata.is_active === true) {
      return true;
    }
    return false;
  };
  const renderLayout = (info, index) => (
    <div className='vendors-only' key={info.vendor_id}>
      <MenuItemKit disabled={!getDisabled(info)} onClick={() => handleChange(info)}>
        <CheckboxKit
          checked={vendorsSelected.map((obj) => obj.vendor_id).indexOf(info.vendor_id) > -1}
        />
        <img
          className='restaurant-img'
          src={info.platform === 'talabat' ? talabat : deliveroo}
          alt={info.platform}
        />
        <TooltipKit
          onClick={(e) => e.stopPropagation()}
          interactive={1}
          disableHoverListener={!getHoverStatusVendor(info.data.vendor_name)}
          id='category-tooltip'
          title={info.data.vendor_name}
        >
          <div
            role='presentation'
            tabIndex={-1}
            onClick={() => handleChange(info)}
            className='tooltip-vendor'
          >
            {info.data.vendor_name}
          </div>
        </TooltipKit>
        <div
          role='presentation'
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className='only-button'
        >
          <ButtonKit onClick={(e) => handleClick(e, index)} variant='contained'>
            Only
          </ButtonKit>
        </div>
      </MenuItemKit>
    </div>
  );
  return (
    <div className={`restaurant-dropdown_wrapper old ${className}`}>
      {!branch ? (
        <TypographyKit className='top-text-inputs' variant='subtitle'>
          Select a Vendor
        </TypographyKit>
      ) : (
        ''
      )}
      <FormControlKit sx={{ m: 1, width: 300 }}>
        <SelectKit
          labelId='demo-multiple-checkbox-label'
          id='demo-multiple-checkbox-vendors-old'
          multiple
          value={vendorsSelected}
          input={<OutlinedInputKit />}
          renderValue={(selected) => (
            <div style={{ display: 'flex', alignItems: 'center', width: '90%', gridGap: '10px' }}>
              <img className='select_icon' src={selectIcon} alt='Select Icon' />
              <span
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '90%',
                }}
              >
                {selected.map((obj) => obj?.data?.vendor_name).join(', ')}
              </span>
            </div>
          )}
          MenuProps={MenuProps}
          sx={{ textTransform: 'capitalize', paddingLeft: '25px', paddingRight: '0px' }}
        >
          <div className='dropdown-paper'>
            {!listing && !branch ? (
              <div className='selected-chains'>
                <p>Selected: {(cost ? state.vendorsSelected : vendorsSelected).length}</p>
                <ButtonKit
                  disabled={
                    vendors.length === (cost ? state.vendorsSelected : vendorsSelected).length
                  }
                  onClick={selectAll}
                  variant='contained'
                >
                  Select All
                </ButtonKit>
              </div>
            ) : (
              ''
            )}
            {!listing ? vendors?.map((info, index) => renderLayout(info, index)) : ''}
          </div>
        </SelectKit>
      </FormControlKit>
    </div>
  );
};

export default RestaurantDropdownOld;
