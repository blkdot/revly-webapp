import { usePlatform, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit, FormControlKit, SelectKit, TypographyKit } from 'kits';
import { useEffect } from 'react';
import selectIcon from '../../assets/images/ic_select.png';
import { vendorsAtom } from '../../store/vendorsAtom';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';
import './RestaurantDropdown.scss';

const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 500,
    },
  },
};
const MenuPropsBranch = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 450,
    },
  },
};

const RestaurantDropdown = ({ setState, state, branch, cost, listing, className }: any) => {
  const [vendorsContext, setVendors] = useAtom(vendorsAtom);
  const { vendors: vendorsReq } = useVendors(undefined);
  useEffect(() => {
    if (vendorsReq.vendorsArr.length > 0) {
      setVendors(vendorsReq);
    }
  }, [vendorsReq]);

  const { display, vendorsObj } = state || vendorsContext;
  const selectedVendors = (name) => {
    const arr = [];
    Object.keys(display).forEach((cName) => {
      Object.keys(display[cName]).forEach((vName) => {
        if (display[cName][vName].checked) {
          if (name === 'name') {
            arr.push(vName);
          } else {
            arr.push(display[cName][vName]);
          }
        }
      });
    });
    return arr;
  };
  // function for vendor
  const handleChangeVendor = (target, chainName) => {
    const { value, checked } = target;
    const displayTemp = JSON.parse(JSON.stringify(display));
    const vendorsObjTemp = JSON.parse(JSON.stringify(vendorsObj));
    if (selectedVendors('name').length > 1) {
      if (!checked) {
        displayTemp[chainName][value].checked = false;
        Object.keys(displayTemp[chainName][value].platforms).forEach((platform) => {
          vendorsObjTemp[platform].splice(
            vendorsObjTemp[platform].findIndex(
              (obj) => obj.vendor_id === displayTemp[chainName][value].platforms[platform].vendor_id
            ),
            1
          );
        });
        if (state) {
          setState({ ...state, display: displayTemp, vendorsObj: vendorsObjTemp });
          return;
        }
        setVendors({ ...vendorsContext, display: displayTemp, vendorsObj: vendorsObjTemp });
        return;
      }
    }
    if (checked) {
      if (listing) {
        Object.keys(displayTemp).forEach((cName) => {
          Object.keys(displayTemp[cName]).forEach((vName) => {
            displayTemp[cName][vName].checked = false;
          });
        });
        Object.keys(displayTemp[chainName][value].platforms).forEach((platform) => {
          vendorsObjTemp[platform] = [displayTemp[chainName][value].platforms[platform]];
        });
        displayTemp[chainName][value].checked = true;
        setState({ ...state, display: displayTemp, vendorsObj: vendorsObjTemp });
        return;
      }
      if (branch) {
        if (
          selectedVendors('object').every(
            (obj: any) => obj.email === displayTemp[chainName][value].email
          )
        ) {
          displayTemp[chainName][value].checked = true;
          Object.keys(displayTemp[chainName][value].platforms).forEach((platform) => {
            vendorsObjTemp[platform].push(displayTemp[chainName][value].platforms[platform]);
          });
        } else {
          Object.keys(displayTemp).forEach((cName) => {
            Object.keys(displayTemp[cName]).forEach((vName) => {
              displayTemp[cName][vName].checked = false;
            });
          });
          Object.keys(displayTemp[chainName][value].platforms).forEach((platform) => {
            vendorsObjTemp[platform] = [displayTemp[chainName][value].platforms[platform]];
          });
          displayTemp[chainName][value].checked = true;
        }
        setState({ ...state, display: displayTemp, vendorsObj: vendorsObjTemp });
        return;
      }
      displayTemp[chainName][value].checked = true;
      Object.keys(displayTemp[chainName][value].platforms).forEach((platform) => {
        vendorsObjTemp[platform].push(displayTemp[chainName][value].platforms[platform]);
      });
      if (state) {
        setState({ ...state, display: displayTemp, vendorsObj: vendorsObjTemp });
        return;
      }
      setVendors({ ...vendorsContext, display: displayTemp, vendorsObj: vendorsObjTemp });
    }
  };
  const selectAll = () => {
    const displayTemp = JSON.parse(JSON.stringify(display));
    Object.keys(displayTemp).forEach((cName) => {
      Object.keys(displayTemp[cName]).forEach((vName) => {
        displayTemp[cName][vName].checked = true;
      });
    });
    if (state) {
      setState({ ...state, display: displayTemp });
      return;
    }
    setVendors({ ...vendorsContext, display: displayTemp });
  };
  return (
    <div
      className={`restaurant-dropdown_wrapper ${cost || listing ? 'cost' : ''} ${className || ''}`}
    >
      {!(listing || branch) ? (
        <TypographyKit className='top-text-inputs' variant='subtitle'>
          Select a Vendor
        </TypographyKit>
      ) : (
        ''
      )}
      <FormControlKit fullWidth>
        <SelectKit
          labelId='demo-simple-select-label'
          id='demo-multiple-checkbox-vendors-new'
          multiple
          value={[1]}
          MenuProps={cost ? MenuPropsBranch : MenuProps}
          renderValue={() => (
            <div className='selected-dropdown'>
              <img className='select_icon' src={selectIcon} alt='Select Icon' />
              <p>{selectedVendors('name').join(', ')}</p>
            </div>
          )}
        >
          <div className={`dropdown-paper ${cost ? 'cost' : ''}`}>
            {!(listing || cost || branch) ? (
              <div className='selected-chains'>
                <p>Selected: {selectedVendors('name').length}</p>
                <ButtonKit disabled={false} onClick={selectAll} variant='contained'>
                  Select All
                </ButtonKit>
              </div>
            ) : (
              ''
            )}
            {Object.keys(display).map((el, index) => (
              <RestaurantCheckboxAccordion
                key={el}
                info={display[el]}
                chainName={el}
                handleChangeVendor={handleChangeVendor}
                cost={cost}
                index={index}
                setVendors={state ? setState : setVendors}
                vendors={vendorsContext}
                display={display}
                listing={listing}
              />
            ))}
          </div>
        </SelectKit>
      </FormControlKit>
    </div>
  );
};

export default RestaurantDropdown;
