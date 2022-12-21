import React, { useEffect } from 'react';

import './RestaurantDropdown.scss';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';
import BranchesIcon from '../../assets/images/ic_branch.png';
import useVendors from '../../hooks/useVendors';
import useDate from '../../hooks/useDate';
import SelectKit from '../../kits/select/SelectKit';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import ButtonKit from '../../kits/button/ButtonKit';

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

const RestaurantDropdown = ({
  setState,
  state,
  branch,
  cost,
  chainObj: chainObjProps,
  platforms,
}) => {
  const chainObj = chainObjProps;

  const { setVendors, vendors: vendorsContext } = useDate();
  const { vendors: vendorsReq } = useVendors();

  useEffect(() => {
    window.onbeforeunload = (e) => {
      localStorage.setItem('leaveTime', JSON.stringify(new Date()));
      e.target.hidden = true;
      return '';
    };
    if (vendorsReq.vendorsArr.length < 0) {
      setVendors(vendorsReq);
    }
  }, [vendorsReq]);
  const { vendorsObj, display } = vendorsContext;
  const handleChange = (value, checked) => {
    const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
    if (branch || cost) {
      if (checked) {
        const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj));
        Object.keys(display).forEach((cName) => {
          if (cName !== value) {
            chainObjTemp[cName] = {};
          } else {
            chainObjTemp[value] = display[value];
            vendorsObjTemp.talabat = [];
            vendorsObjTemp.deliveroo = [];
            Object.keys(chainObjTemp[value]).forEach((vName) => {
              platforms.forEach((platform) => {
                vendorsObjTemp[platform]?.splice(0, 0, display[value][vName][platform]);
              });
            });
          }
        });
        setState({ ...state, vendorsObj: vendorsObjTemp, chainObj: chainObjTemp });
      }
    } else {
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
          setVendors({
            ...vendorsContext,
            chainObj: chainObjTemp,
            vendorsObj,
          });
        }
        if (checked) {
          Object.keys(display).forEach((cName) => {
            if (cName === value) {
              Object.keys(display[value]).forEach((n) => {
                Object.keys(display[value][n]).forEach((platform) => {
                  vendorsObj[platform]?.splice(0, 0, display[value][n][platform]);
                });
              });
              chainObjTemp[value] = display[value];
            }
          });

          setVendors({
            ...vendorsContext,
            vendorsObj,
            chainObj: chainObjTemp,
          });
        }
      }
      if (checked) {
        Object.keys(display).forEach((cName) => {
          if (cName === value) {
            Object.keys(display[value]).forEach((n) => {
              Object.keys(display[value][n]).forEach((platform) => {
                vendorsObj[platform]?.splice(0, 0, display[value][n][platform]);
              });
            });
            chainObjTemp[value] = display[value];
          }
        });

        setVendors({
          ...vendorsContext,
          vendorsObj,
          chainObj: chainObjTemp,
        });
      }
    }
  };
  const handleChangeVendor = (event, chainName) => {
    const {
      target: { value, checked },
    } = event;
    if (branch || cost) {
      if (Object.keys(chainObj[chainName]).length > 1) {
        if (!checked) {
          const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
          const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj));
          delete chainObjTemp[chainName][value];
          vendorsObjTemp.talabat = [];
          vendorsObjTemp.deliveroo = [];
          Object.keys(chainObjTemp[chainName]).forEach((vName) => {
            platforms.forEach((platform) => {
              vendorsObjTemp[platform]?.splice(0, 0, display[chainName][vName][platform]);
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
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
        if (cost) {
          Object.keys(chainObjTemp).forEach((cName) => {
            if (cName !== chainName) {
              Object.keys(chainObjTemp[cName]).forEach((vName) => {
                delete chainObjTemp[cName][vName];
              });
            }
          });
        }
        Object.keys(display[chainName]).forEach((vName) => {
          if (vName === value) {
            chainObjTemp[chainName][value] = display[chainName][value];
          }
        });
        const vendorsObjTemp = JSON.parse(JSON.stringify(state?.vendorsObj));
        vendorsObjTemp.talabat = [];
        vendorsObjTemp.deliveroo = [];
        Object.keys(chainObjTemp[chainName]).forEach((vName) => {
          platforms.forEach((platform) => {
            vendorsObjTemp[platform]?.splice(0, 0, display[chainName][vName][platform]);
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
    const chainObjClear = JSON.parse(JSON.stringify(chainObj));
    Object.keys(chainObjClear).forEach((cName) => {
      if (Object.keys(chainObjClear[cName]).length === 0) {
        delete chainObjClear[cName];
      }
    });
    if (Object.keys(chainObjClear[chainName]).length > 1) {
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
        setVendors({
          ...vendorsContext,
          vendorsObj: vendorsObjTemp,
          chainObj: chainObjTemp,
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
      setVendors({
        ...vendorsContext,
        vendorsObj: vendorsObjTemp,
        chainObj: chainObjTemp,
      });
    }
  };
  const getChain = () => {
    const arr = [];
    Object.keys(chainObj).forEach((chainName) => {
      if (Object.keys(chainObj[chainName]).length > 0) {
        arr.push(chainName);
      }
    });
    return arr;
  };
  const selectAll = () => {
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    vendorsContext.vendorsArr.forEach((obj) => {
      vendorsObjTemp[obj.platform] = [...vendorsObjTemp[obj.platform], obj];
    });
    Object.keys(vendorsObjTemp).forEach((p) => {
      if (vendorsObjTemp[p].length < 0) {
        delete vendorsObjTemp[p];
      }
    });
    setVendors({ ...vendorsContext, chainObj: display, vendorsObj: vendorsObjTemp });
  };
  if (branch) {
    return (
      <div className="restaurant-dropdown_wrapper branch">
        <FormcontrolKit fullWidth>
          <SelectKit
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            multiple
            value={getChain()}
            MenuProps={MenuPropsBranch}
            renderValue={() => (
              <div className="selected-dropdown branch">
                <img src={BranchesIcon} alt="branches icon" />
                <p>{getChain().join(', ')}</p>
              </div>
            )}
          >
            <div className="dropdown-paper branch">
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
    <div className={`restaurant-dropdown_wrapper ${cost ? 'cost' : ''}`}>
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <FormcontrolKit fullWidth>
        <SelectKit
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple
          value={getChain()}
          MenuProps={cost ? MenuPropsBranch : MenuProps}
          renderValue={() => (
            <div className="selected-dropdown">
              <img className="select_icon" src={selectIcon} alt="Select Icon" />
              <p>{getChain().join(', ')}</p>
            </div>
          )}
        >
          <div className={`dropdown-paper ${cost ? 'cost' : ''}`}>
            {!cost ? (
              <div className="selected-chains">
                <p>Selected: {getChain().length}</p>
                <ButtonKit
                  disabled={Object.keys(display).length === getChain().length}
                  onClick={selectAll}
                  variant="contained"
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
              />
            ))}
          </div>
        </SelectKit>
      </FormcontrolKit>
    </div>
  );
};

export default RestaurantDropdown;
