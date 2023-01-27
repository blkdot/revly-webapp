import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import selectIcon from '../../assets/images/ic_select.png';
import ButtonKit from '../../kits/button/ButtonKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import RadioKit from '../../kits/radio/RadioKit';
import TooltipKit from '../../kits/toolTip/TooltipKit';

const RestaurantCheckboxAccordion = ({
  info,
  chainName,
  handleChange,
  handleChangeVendor,
  chainObj,
  branch,
  cost,
  index,
  setVendors,
  vendors,
  display,
  listing,
}: any) => {
  const [active, setActive] = useState(false);
  // we checking if all vendor in this chain are checked
  const getChecked = () =>
    Object.values(chainObj[chainName] || {}).length === Object.values(info).length;
  const compareSize = () => {
    // get 1 element of .chain-name
    const textElementChain = document.querySelectorAll('.chain-name')[index];
    // get all elements of .vendor-name
    const textElement = document.querySelectorAll('.vendor-name');
    // checking if scrollWidth more than clientWidth (or have 3 dots on the end of the text)
    const compare = textElementChain?.scrollWidth > textElementChain?.clientWidth;
    const compareArr = [];
    textElement.forEach((el) => {
      // checking if scrollWidth more than clientWidth (or have 3 dots on the end of the text)
      if (el?.scrollWidth > el.clientWidth) {
        // push the textContent of element
        compareArr.push(el.textContent);
      }
    });
    setHoverChain(compare);
    setHoverVendor(compareArr);
  };
  const vendorsNew = document.querySelector('#demo-multiple-checkbox-vendors-new');
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [vendorsNew?.ariaExpanded, active, display]);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [vendorsNew?.ariaExpanded, active, display],
  );

  const [hoverStatusChain, setHoverChain] = useState(false);
  const [hoverStatusVendor, setHoverVendor] = useState([]);
  const getHoverStatusVendor = (vName) => hoverStatusVendor.find((v) => v === vName);
  // function for chain button "Only"
  const handleClick = (e) => {
    e.stopPropagation();
    const vendorsObjTemp = { talabat: [], deliveroo: [] };
    Object.keys(display[chainName]).forEach((vName) => {
      Object.keys(display[chainName][vName]).forEach((p) => {
        vendorsObjTemp[p].push(display[chainName][vName][p]);
      });
    });
    Object.keys(vendorsObjTemp).forEach((p) => {
      if (vendorsObjTemp[p].length === 0) {
        delete vendorsObjTemp[p];
      }
    });
    setVendors({
      ...vendors,
      chainObj: { [chainName]: display[chainName] },
      vendorsObj: vendorsObjTemp,
    });
  };
  // function for vendor button "Only"
  const handleClickVendor = (e, vendorName) => {
    e.stopPropagation();
    const chainObjTemp = { [chainName]: { [vendorName]: { ...display[chainName][vendorName] } } };
    const vendorsObjTemp = {};
    Object.keys(display[chainName][vendorName]).forEach((p) => {
      vendorsObjTemp[p] = [display[chainName][vendorName][p]];
    });
    setVendors({
      ...vendors,
      chainObj: chainObjTemp,
      vendorsObj: vendorsObjTemp,
    });
  };
  const getVendorDisabled = (vendorName) => {
    if (Object.keys(chainObj).length === 1) {
      return (
        Object.keys(chainObj[chainName] || {})[0] === vendorName &&
        Object.keys(chainObj[chainName] || {}).length === 1
      );
    }
    return false;
  };
  const getDisabledChain = () => {
    const arrBool = [];
    Object.keys(info).forEach((vName) => {
      Object.keys(info[vName]).forEach((platform) => {
        if (info[vName][platform].active) {
          arrBool.push(true);
        } else {
          arrBool.push(false);
        }
      });
    });
    return arrBool.some((bool) => bool);
  };
  const getInActiveVendor = (vendorName) => {
    const arrBool = [];
    Object.keys(info[vendorName]).forEach((platform) => {
      if (info[vendorName][platform].active) {
        arrBool.push(true);
      } else {
        arrBool.push(false);
      }
    });
    return arrBool.some((bool) => bool);
  };
  return (
    <div className={`checkbox-accordion-wrapper ${active ? 'active' : ''}`}>
      {!listing ? (
        <div
          tabIndex={-1}
          role="presentation"
          className={`checkbox-accordion ${!getDisabledChain() ? 'disabled' : ''} ${
            active ? 'active' : ''
          }`}
          onClick={() => setActive(!active)}
          // TODO: FIX IT
          // style={{ '--l': Object.keys(info).length }}
        >
          <div>
            <img
              tabIndex={-1}
              role="presentation"
              onClick={(e) => e.stopPropagation()}
              src={selectIcon}
              alt="select icon"
            />
            <div
              style={{
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!cost ? (
                <CheckboxKit
                  disabled={!getDisabledChain()}
                  checked={getChecked()}
                  onClick={(e) => e.stopPropagation()}
                  value={chainName}
                  onChange={(e) => handleChange(e.target.value, e.target.checked)}
                />
              ) : (
                <span style={{ height: 40 }} />
              )}
              <TooltipKit
                id="category-tooltip"
                interactive={1}
                disableHoverListener={!hoverStatusChain}
                title={chainName}
              >
                <p className="chain-name">{chainName}</p>
              </TooltipKit>
            </div>
          </div>
          <ExpandMoreIcon style={{ cursor: 'pointer' }} />
          {!(branch || cost || listing) ? (
            <div className="only-button">
              <ButtonKit
                disabled={
                  (Object.keys(chainObj)[0] === chainName &&
                    Object.keys(chainObj).length === 1 &&
                    Object.keys(chainObj[chainName]).length ===
                      Object.keys(display[chainName]).length) ||
                  !getDisabledChain()
                }
                onClick={handleClick}
                variant="contained"
              >
                Only
              </ButtonKit>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      {Object.keys(info).map((vendorName) => (
        <InputLabelKit
          disabled={!getInActiveVendor(vendorName)}
          key={vendorName}
          className={`accordion-dropdown ${active ? 'active' : ''} ${
            listing ? 'active listing' : ''
          } `}
        >
          <div>
            {listing ? (
              <RadioKit
                disabled={
                  branch
                    ? !(
                        Object.keys(chainObj?.[chainName] || {}).length > 0 ||
                        info[vendorName].active
                      )
                    : !getInActiveVendor(vendorName)
                }
                checked={!!chainObj?.[chainName]?.[vendorName]}
                onChange={(e) => handleChangeVendor(e, chainName)}
                value={vendorName}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <CheckboxKit
                disabled={
                  branch
                    ? !(
                        Object.keys(chainObj?.[chainName] || {}).length > 0 ||
                        info[vendorName].active
                      )
                    : !getInActiveVendor(vendorName)
                }
                checked={!!chainObj?.[chainName]?.[vendorName]}
                onChange={(e) => handleChangeVendor(e, chainName)}
                value={vendorName}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <TooltipKit
              id="category-tooltip"
              interactive={1}
              disableHoverListener={!getHoverStatusVendor(vendorName)}
              title={vendorName}
            >
              <p className="vendor-name">{vendorName}</p>
            </TooltipKit>
            {!(branch || cost || listing || !getInActiveVendor(vendorName)) ? (
              <div className="only-button vendor">
                <ButtonKit
                  disabled={getVendorDisabled(vendorName)}
                  onClick={(e) => handleClickVendor(e, vendorName)}
                  variant="contained"
                >
                  Only
                </ButtonKit>
              </div>
            ) : (
              ''
            )}
          </div>
        </InputLabelKit>
      ))}
    </div>
  );
};

export default RestaurantCheckboxAccordion;
