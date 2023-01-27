import { useAtom } from 'jotai';
import { useEffect } from 'react';
import BranchesIcon from '../../assets/images/ic_branch.png';
import selectIcon from '../../assets/images/ic_select.png';
import { usePlatform } from '../../hooks/usePlatform';
import useVendors from '../../hooks/useVendors';
import ButtonKit from '../../kits/button/ButtonKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import SelectKit from '../../kits/select/SelectKit';
import TypographyKit from '../../kits/typography/TypographyKit';
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

const RestaurantDropdownNew = ({
  setState,
  state,
  branch,
  cost,
  chainObj: chainObjProps,
  listing,
}: any) => {
  const chainObj = chainObjProps;

  const [vendorsContext, setVendors] = useAtom(vendorsAtom);
  const { vendors: vendorsReq } = useVendors(undefined);
  const { userPlatformData } = usePlatform();
  useEffect(() => {
    if (vendorsReq.vendorsArr.length < 0) {
      setVendors(vendorsReq);
    }
  }, [vendorsReq]);
  useEffect(() => {
    const vendorsObjTemp = {};
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((vendorName) => {
        Object.keys(chainObj[chainName][vendorName]).forEach((platform) => {
          // we doing this all Object.keys to get the inside of chainObj

          chainObj[chainName][vendorName][platform] = {
            ...chainObj[chainName][vendorName][platform],
            active: userPlatformData.platforms[platform].active, // we put the active and check in RestaurantCheckboxAccardion
          };

          // we check if inside object its null or dont exist vendor_id
          if (
            chainObj[chainName][vendorName][platform] === null ||
            !chainObj[chainName][vendorName][platform].vendor_id
          ) {
            delete chainObj[chainName][vendorName][platform]; // if inside object its null or dont exist vendor_id we delete this object
          } else if ((vendorsObjTemp[platform] || []).length === 0) {
            // we check if vendorsObjTemp is empty
            if (userPlatformData.platforms[platform].active) {
              // checking if platform (talabat or deliveroo) is active
              vendorsObjTemp[platform] = [chainObj[chainName][vendorName][platform]]; // if platform active we put the new value to vendorObjTemp[platform (talabat or deliveroo)]
            }
          } else if (userPlatformData.platforms[platform].active) {
            // checking if platform (talabat or deliveroo) is active
            vendorsObjTemp[platform] = [
              ...vendorsObjTemp[platform],
              chainObj[chainName][vendorName][platform],
            ]; // if vendorsObjTemp[platform (talabat or deliveroo)] is not empty we taking previous value and add the new value
          }
        });
      });
    });
    setVendors({ ...vendorsContext, chainObj, vendorsObj: vendorsObjTemp });
  }, [userPlatformData.platforms]);
  const { vendorsObj, display } = vendorsContext;
  // function for chain
  const handleChange = (value, checked) => {
    const chainObjTemp = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to change in later on
    if (branch || cost) {
      // its for vendors where we change own states not global
      if (checked) {
        const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj)); // copy vendorsObj to change in later on
        Object.keys(display).forEach((chainName) => {
          if (chainName !== value) {
            // if chainName not equal value we delete inside of this chainObjTemp[chainName]
            chainObjTemp[chainName] = {};
          } else {
            // and if chainName equal value we put the data from display[chainName] to chainObjTemp[chainName]
            chainObjTemp[chainName] = display[chainName];

            // we clearing inside of vendorsObjTemp
            vendorsObjTemp.talabat = [];
            vendorsObjTemp.deliveroo = [];

            Object.keys(chainObjTemp[chainName]).forEach((vendorName) => {
              Object.keys(chainObjTemp[chainName][vendorName]).forEach((platform) => {
                // we check if platform (talbat or deliveroo) is active
                if (userPlatformData.platforms[platform].active) {
                  vendorsObjTemp[platform]?.splice(0, 0, display[chainName][vendorName][platform]); // if platform (talbat or deliveroo) is active we just put the data
                }
              });
            });
          }
        });
        setState({ ...state, vendorsObj: vendorsObjTemp, chainObj: chainObjTemp }); // we save the changes
      }
    } else {
      // its for global vendors
      const chainObjClear = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to clear him and use for check
      Object.keys(chainObjClear).forEach((chainName) => {
        if (Object.keys(chainObjClear[chainName]).length === 0) {
          // if chainObjClear dont have vendors we just delete him
          delete chainObjClear[chainName];
        }
      });
      if (Object.keys(chainObjClear).length > 1) {
        // if chainObjClear have at least 1 chain because we cant unchecked all of them
        if (!checked) {
          // we unchecking the chain
          Object.keys(chainObj[value]).forEach((vendorName) => {
            Object.keys(chainObjTemp[value][vendorName]).forEach((platform) => {
              vendorsObj[platform]?.forEach((obj, index) => {
                if (+obj.chain_id === chainObjTemp[value][vendorName][platform].chain_id) {
                  vendorsObj[platform].splice(index, 1); // we deleting the object inside of vendorObj which equal
                }
              });
            });
            delete chainObjTemp[value][vendorName]; // we deleting the vendorName inside of chainObjTemp
          });
          if (listing) {
            // its for vendors where we change own states not global
            setState({
              ...state,
              chainObj: chainObjTemp,
              vendorsObj,
            });
          } else {
            setVendors({
              ...vendorsContext,
              chainObj: chainObjTemp,
              vendorsObj,
            });
          }
        }
      }
      if (checked) {
        Object.keys(display).forEach((chainName) => {
          if (chainName === value) {
            // we checking which chainName from display equal value
            Object.keys(display[value]).forEach((n) => {
              Object.keys(display[value][n]).forEach((platform) => {
                if (userPlatformData.platforms[platform].active) {
                  // we checking is platform active
                  if (!vendorsObj[platform]) {
                    // we checking if vendorsObj[platform (talabat or deliveroo)] its empty
                    vendorsObj[platform] = [display[value][n][platform]]; // if vendorsObj[platform (talabat or deliveroo)] its empty we put the new value
                  } else {
                    vendorsObj[platform]?.push(display[value][n][platform]); // if vendorsObj[platform (talabat or deliveroo)] its not empty we just push the new value
                  }
                }
              });
            });
            chainObjTemp[chainName] = display[chainName]; // we put to chainObjTemp[chainName] the new value
          }
        });

        if (listing) {
          // its for vendors where we change own states not global
          setState({
            ...state,
            chainObj: chainObjTemp,
            vendorsObj,
          });
        } else {
          setVendors({
            ...vendorsContext,
            chainObj: chainObjTemp,
            vendorsObj,
          });
        }
      }
    }
  };
  // function for vendor
  const handleChangeVendor = (event, chainName) => {
    const {
      target: { value, checked },
    } = event;
    if (branch || cost) {
      // its for vendors where we change own states not global
      if (Object.keys(chainObj[chainName] || {}).length > 1) {
        // if chain have at least 1 vendor because we cant unchecked all of them
        if (!checked) {
          const chainObjTemp = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to change in later on
          const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj)); // copy vendorsObj to change in later on
          delete chainObjTemp[chainName][value]; // we delete unchecked vendor from chainObjTemp

          // we clearing inside of vendorsObjTemp
          vendorsObjTemp.talabat = [];
          vendorsObjTemp.deliveroo = [];

          Object.keys(chainObjTemp[chainName]).forEach((vendorName) => {
            Object.keys(chainObjTemp[chainName][vendorName]).forEach((platform) => {
              vendorsObjTemp[platform]?.push(display[chainName][vendorName][platform]); // push the new values from chainObjTemp
            });
          });
          setState({
            ...state,
            vendorsObj: vendorsObjTemp,
            chainObj: chainObjTemp,
          });
        }
      }
      if (checked) {
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to change in later on
        if (cost) {
          Object.keys(chainObjTemp).forEach((chain) => {
            if (chain !== chainName) {
              // checking if chain of chainObjTemp not equal chainName of checked vendor
              Object.keys(chainObjTemp[chain]).forEach((vendorName) => {
                delete chainObjTemp[chain][vendorName]; // delete vendor from chainObjTemp
              });
            }
          });
        }
        Object.keys(display[chainName]).forEach((vendorName) => {
          if (vendorName === value) {
            // checking if value equal vendorName
            chainObjTemp[chainName] = {
              ...chainObjTemp[chainName],
              [value]: { ...display[chainName][value] },
            }; // put the new value to vendor
          }
        });
        const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj)); // copy vendorsObj to change in later on
        // clear inside of vendorsObjTemp
        vendorsObjTemp.talabat = [];
        vendorsObjTemp.deliveroo = [];

        Object.keys(chainObjTemp[chainName]).forEach((vendorName) => {
          Object.keys(chainObjTemp[chainName][vendorName]).forEach((platform) => {
            if (userPlatformData.platforms[platform].active) {
              // checking if platform is active
              vendorsObjTemp[platform]?.push(display[chainName][vendorName][platform]); // pushing new value to vendorsObjTemp
            }
          });
        });
        setState({
          ...state,
          vendorsObj: vendorsObjTemp,
          chainObj: chainObjTemp,
        });
      }
      return;
    }
    const chainObjClear = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to clear him and use for check
    Object.keys(chainObjClear).forEach((chain) => {
      if (Object.keys(chainObjClear[chain]).length === 0) {
        // if chainObjClear dont have vendors we just delete him
        delete chainObjClear[chain];
      }
    });
    // if chainObjClear or chainObjClear[chainName] (vendor) have at least 1 chain or vendor because we cant unchecked all of them
    if (
      Object.keys(chainObjClear).length > 1 ||
      Object.keys(chainObjClear[chainName] || {}).length > 1
    ) {
      if (!checked) {
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj)); // copy chainObj to change in later on
        const vendorsObjTemp = JSON.parse(JSON.stringify(vendorsObj)); // copy vendorsObj to change in later on
        Object?.keys(chainObjTemp?.[chainName]?.[value])?.forEach((platform) => {
          vendorsObjTemp[platform]?.forEach((obj, index) => {
            if (+obj.chain_id === chainObjTemp[chainName][value][platform].chain_id) {
              vendorsObjTemp[platform].splice(index, 1); // we deleting the object inside of vendorObj which equal
            }
          });
        });
        delete chainObjTemp[chainName][value]; // we deleting the vendorName inside of chainObjTemp
        Object.keys(vendorsObjTemp).forEach((p) => {
          if (vendorsObjTemp[p].length === 0) {
            delete vendorsObjTemp[p]; // deleting empty array
          }
        });
        // its for vendors where we change own states not global
        if (listing) {
          setState({
            ...state,
            vendorsObj: vendorsObjTemp,
            chainObj: chainObjTemp,
          });
        } else {
          setVendors({
            ...vendorsContext,
            vendorsObj: vendorsObjTemp,
            chainObj: chainObjTemp,
          });
        }
      }
    }
    if (checked) {
      // copy chainObj and add to chainName the new value
      const chainObjTemp = {
        ...chainObj,
        [chainName]: { ...chainObj[chainName], [value]: { ...display[chainName][value] } },
      };
      const vendorsObjTemp = { ...vendorsObj }; // copy vendorObj
      Object.keys(display[chainName][value]).forEach((p) => {
        if (userPlatformData.platforms[p].active) {
          // check if platform is active
          if (vendorsObjTemp[p]) {
            // checking vendorsObjTemp[p (talabat or deliveroo)] is true
            vendorsObjTemp[p] = [...vendorsObjTemp[p], display[chainName][value][p]]; // copy the old value and add the new value
          } else {
            vendorsObjTemp[p] = [display[chainName][value][p]]; // add to array the new value
          }
        }
      });
      // its for vendors where we change own states not global
      if (listing) {
        setState({
          ...state,
          vendorsObj: vendorsObjTemp,
          chainObj: chainObjTemp,
        });
      } else {
        setVendors({
          ...vendorsContext,
          vendorsObj: vendorsObjTemp,
          chainObj: chainObjTemp,
        });
      }
    }
  };
  const getChain = () => {
    const arr = [];
    Object.keys(chainObj).forEach((chainName) => {
      // checking chain is not empty
      if (Object.keys(chainObj[chainName]).length > 0) {
        // if chain is not empty we puhs chainName to arr
        arr.push(chainName);
      }
    });
    return arr;
  };
  const selectAll = () => {
    const vendorsObjTemp = { talabat: [], deliveroo: [] }; // clear array
    vendorsContext.vendorsArr.forEach((obj) => {
      // put the object to platforms array
      vendorsObjTemp[obj.platform] = [...vendorsObjTemp[obj.platform], obj];
    });
    Object.keys(vendorsObjTemp).forEach((p) => {
      // check if array of platform is empty
      if (vendorsObjTemp[p].length < 0) {
        delete vendorsObjTemp[p]; // if array of platform is empty we delete him
      }
    });
    setVendors({ ...vendorsContext, chainObj: display, vendorsObj: vendorsObjTemp });
  };
  if (branch) {
    return (
      <div className='restaurant-dropdown_wrapper branch'>
        <FormcontrolKit fullWidth>
          <SelectKit
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            multiple
            value={getChain()}
            MenuProps={MenuPropsBranch}
            renderValue={() => (
              <div className='selected-dropdown branch'>
                <img src={BranchesIcon} alt='branches icon' />
                <p>{getChain().join(', ')}</p>
              </div>
            )}
          >
            <div className='dropdown-paper branch'>
              {Object.keys(display).map((el, index) => (
                <RestaurantCheckboxAccordion
                  key={el}
                  handleChange={handleChange}
                  info={display[el]}
                  chainName={el}
                  handleChangeVendor={handleChangeVendor}
                  chainObj={chainObj}
                  cost={cost}
                  index={index}
                  setVendors={setState}
                  vendors={state}
                  display={state.display}
                  branch
                />
              ))}
            </div>
          </SelectKit>
        </FormcontrolKit>
      </div>
    );
  }

  return (
    <div className={`restaurant-dropdown_wrapper ${cost || listing ? 'cost' : ''}`}>
      {!listing ? (
        <TypographyKit className='top-text-inputs' variant='subtitle'>
          Select a Vendor
        </TypographyKit>
      ) : (
        ''
      )}
      <FormcontrolKit fullWidth>
        <SelectKit
          labelId='demo-simple-select-label'
          id='demo-multiple-checkbox-vendors-new'
          multiple
          value={getChain()}
          MenuProps={cost ? MenuPropsBranch : MenuProps}
          renderValue={() => (
            <div className='selected-dropdown'>
              <img className='select_icon' src={selectIcon} alt='Select Icon' />
              <p>{getChain().join(', ')}</p>
            </div>
          )}
        >
          <div className={`dropdown-paper ${cost ? 'cost' : ''}`}>
            {!(listing || cost) ? (
              <div className='selected-chains'>
                <p>Selected: {getChain().length}</p>
                <ButtonKit
                  disabled={Object.keys(display).length === getChain().length}
                  onClick={selectAll}
                  variant='contained'
                >
                  Select All
                </ButtonKit>
              </div>
            ) : (
              ''
            )}
            {Object.keys(display).map((el, index) => (
              <RestaurantCheckboxAccordion
                key={el}
                handleChange={handleChange}
                info={display[el]}
                chainName={el}
                handleChangeVendor={handleChangeVendor}
                chainObj={chainObj}
                cost={cost}
                index={index}
                setVendors={setVendors}
                vendors={vendorsContext}
                display={display}
                listing={listing}
              />
            ))}
          </div>
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default RestaurantDropdownNew;
