import React, { useState } from 'react';

import './RestaurantDropdown.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDate from '../../hooks/useDate';
import selectIcon from '../../assets/images/ic_select.png';
import TypographyKit from '../../kits/typography/TypographyKit';
import RestaurantCheckboxAccordion from './RestaurantCheckboxAccardion';
import BranchesIcon from '../../assets/images/ic_branch.png';

const RestaurantDropdown = ({ setState, state, branch, chainObj: chainObjProps, platforms }) => {
  const chainObj = chainObjProps;
  onbeforeunload = (e) => {
    localStorage.removeItem('vendors');
    localStorage.setItem('leaveTime', JSON.stringify(new Date()));
    e.target.hidden = true;
    return '';
  };
  const { setVendors, vendors: vendorsContext } = useDate();
  const { vendorsObj, display } = vendorsContext;
  const [active, setActive] = useState(false);
  const handleChange = (value, checked) => {
    if (branch) {
      if (checked) {
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
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
          const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
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
          });
          localStorage.setItem(
            'vendors',
            JSON.stringify({
              ...vendorsContext,
              chainObj: chainObjTemp,
            }),
          );
        }
        if (checked) {
          const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
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
          localStorage.setItem(
            'vendors',
            JSON.stringify({
              ...vendorsContext,
              vendorsObj,
              chainObj: chainObjTemp,
            }),
          );
        }
      }
    }
  };
  const handleChangeVendor = (event, chainName) => {
    const {
      target: { value, checked },
    } = event;
    if (branch) {
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
    if (Object.keys(chainObj[chainName]).length > 0) {
      if (!checked) {
        const chainObjTemp = JSON.parse(JSON.stringify(chainObj));
        delete chainObjTemp[chainName][value];
        Object.keys(chainObjTemp[chainName][value]).forEach((platform) => {
          vendorsObj[platform]?.forEach((obj, index) => {
            if (+obj.chain_id === chainObjTemp[chainName][value][platform].chain_id) {
              vendorsObj[platform].splice(index, 1);
            }
          });
        });
        setVendors({
          ...vendorsContext,
          vendorsObj,
          chainObj: chainObjTemp,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            ...vendorsContext,
            vendorsObj,
            chainObj: chainObjTemp,
          }),
        );
      }
    }
    if (checked) {
      const chainObjTemp = JSON.parse(JSON.stringify(chainObj));

      Object.keys(display[chainName][value]).forEach((platform) => {
        vendorsObj[platform]?.splice(0, 0, display[chainName][value][platform]);
      });
      Object.keys(display[chainName]).forEach((vName) => {
        if (vName === value) {
          chainObjTemp[chainName][value] = display[chainName][value];
        }
      });
      setVendors({
        ...vendorsContext,
        vendorsObj,
        chainObj: chainObjTemp,
      });
      localStorage.setItem(
        'vendors',
        JSON.stringify({
          ...vendorsContext,
          vendorsObj,
          chainObj: chainObjTemp,
        }),
      );
    }
  };
  const handleClick = () => {
    const body = document.querySelector('body');
    const marketingSetup = document.querySelector('#marketing-setup');
    if (branch) {
      if (active) {
        marketingSetup.style.overflowY = 'visible';
        setActive(false);
        return;
      }
      marketingSetup.style.overflowY = 'hidden';
      setActive(true);
      return;
    }
    if (active) {
      body.style.overflowY = 'visible';
      setActive(false);
      return;
    }
    body.style.overflowY = 'hidden';
    setActive(true);
  };
  const getChain = () => {
    const arr = [];
    Object.keys(chainObj).forEach((chainName) => {
      if (Object.keys(chainObj[chainName]).length > 0) {
        arr.push(chainName);
      }
    });
    return arr.join(', ');
  };
  if (branch) {
    return (
      <div className="restaurant-dropdown_wrapper branch">
        <div tabIndex={-1} role="presentation" onClick={handleClick} style={{ width: '100%' }}>
          <div>
            <img src={BranchesIcon} alt="branches icon" />
            <TypographyKit className="restaurants-selected" variant="div">
              <div>{getChain()}</div>
            </TypographyKit>
          </div>
          <ExpandMoreIcon />
        </div>
        <div
          tabIndex={-1}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          className={`dropdown-paper ${active ? 'active' : ''}`}
        >
          {Object.keys(display).map((el) => (
            <RestaurantCheckboxAccordion
              key={el}
              handleChange={handleChange}
              info={display[el]}
              chainName={el}
              chainArr={Object.keys(chainObj)}
              handleChangeVendor={handleChangeVendor}
              chainObj={chainObj}
            />
          ))}
        </div>
        <div
          tabIndex={-1}
          role="presentation"
          onClick={handleClick}
          className={`dropdown-overlay ${active ? 'active' : ''}`}
        />
      </div>
    );
  }
  return (
    <div className="restaurant-dropdown_wrapper">
      <TypographyKit className="top-text-inputs" variant="subtitle">
        Select a Vendor
      </TypographyKit>
      <div tabIndex={-1} role="presentation" onClick={handleClick} style={{ width: 300 }}>
        <img className="select_icon" src={selectIcon} alt="Select Icon" />
        <TypographyKit className="restaurants-selected" variant="div">
          <div>{getChain()}</div>
        </TypographyKit>
        <ExpandMoreIcon />
      </div>
      <div
        tabIndex={-1}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        className={`dropdown-paper ${active ? 'active' : ''}`}
      >
        {Object.keys(display).map((el) => (
          <RestaurantCheckboxAccordion
            key={el}
            handleChange={handleChange}
            info={display[el]}
            chainName={el}
            chainArr={Object.keys(chainObj)}
            handleChangeVendor={handleChangeVendor}
            chainObj={chainObj}
          />
        ))}
      </div>
      <div
        tabIndex={-1}
        role="presentation"
        onClick={handleClick}
        className={`dropdown-overlay ${active ? 'active' : ''}`}
      />
    </div>
  );
};

export default RestaurantDropdown;
