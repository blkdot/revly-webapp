import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import selectIcon from '../../assets/images/ic_select.png';
import TooltipKit from '../../kits/toolTip/TooltipKit';
import ButtonKit from '../../kits/button/ButtonKit';

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
}) => {
  const [active, setActive] = useState(false);
  const getChecked = () =>
    Object.values(chainObj[chainName] || {}).length === Object.values(info).length;
  const compareSize = () => {
    const textElementChain = document.querySelectorAll('.chain-name')[index];
    const textElement = document.querySelectorAll('.vendor-name');
    const compare = textElementChain?.scrollWidth > textElementChain?.clientWidth;
    const compareArr = [];
    textElement.forEach((el) => {
      if (el?.scrollWidth > el.clientWidth) {
        compareArr.push(el.textContent);
      }
    });
    setHoverChain(compare);
    setHoverVendor(compareArr);
  };
  const root = document.querySelector('#root');
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [root.ariaHidden, active]);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    [root.ariaHidden, active],
  );

  const [hoverStatusChain, setHoverChain] = useState(false);
  const [hoverStatusVendor, setHoverVendor] = useState([]);
  const getHoverStatusVendor = (vName) => hoverStatusVendor.find((v) => v === vName);
  const handleClick = (e) => {
    e.stopPropagation();
    let vendorsObjTemp = {};
    Object.keys(display[chainName]).forEach((vName) => {
      Object.keys(display[chainName][vName]).forEach((p) => {
        vendorsObjTemp = { ...vendorsObjTemp, [p]: [display[chainName][vName][p]] };
      });
    });
    setVendors({
      ...vendors,
      chainObj: { [chainName]: display[chainName] },
      vendorsObj: vendorsObjTemp,
    });
  };
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
  return (
    <div className={`checkbox-accordion-wrapper ${active ? 'active' : ''}`}>
      <div
        tabIndex={-1}
        role="presentation"
        className={`checkbox-accordion ${active ? 'active' : ''}`}
        onClick={() => setActive(!active)}
        style={{ '--l': Object.keys(info).length }}
      >
        <div>
          <img
            tabIndex={-1}
            role="presentation"
            onClick={(e) => e.stopPropagation()}
            src={selectIcon}
            alt="select icon"
          />
          <div style={{ cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center' }}>
            {!cost ? (
              <CheckboxKit
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
        {!(branch || cost) ? (
          <div className="only-button">
            <ButtonKit onClick={handleClick} variant="contained">
              Only
            </ButtonKit>
          </div>
        ) : (
          ''
        )}
      </div>
      {Object.keys(info).map((vendorName) => (
        <InputLabelKit key={vendorName} className={`accordion-dropdown ${active ? 'active' : ''}`}>
          <div>
            <CheckboxKit
              disabled={branch ? !(Object.keys(chainObj?.[chainName] || {}).length > 0) : false}
              checked={!!chainObj?.[chainName]?.[vendorName]}
              onChange={(e) => handleChangeVendor(e, chainName)}
              value={vendorName}
              onClick={(e) => e.stopPropagation()}
            />
            <TooltipKit
              id="category-tooltip"
              interactive={1}
              disableHoverListener={!getHoverStatusVendor(vendorName)}
              title={vendorName}
            >
              <p className="vendor-name">{vendorName}</p>
            </TooltipKit>
            {!(branch || cost) ? (
              <div className="only-button vendor">
                <ButtonKit onClick={(e) => handleClickVendor(e, vendorName)} variant="contained">
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
