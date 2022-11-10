import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import selectIcon from '../../assets/images/ic_select.png';

const RestaurantCheckboxAccordion = ({
  info,
  chainName,
  handleChange,
  handleChangeVendor,
  chainObj,
}) => {
  const [active, setActive] = useState(false);
  const getChecked = () => {
    const arr = Object.keys(chainObj[chainName]).map((n) => chainObj[chainName][n].checked);
    return arr.every((bool) => bool === true);
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
          <CheckboxKit
            checked={getChecked()}
            onClick={(e) => e.stopPropagation()}
            value={chainName}
            onChange={(e) => handleChange(e)}
          />
          {chainName}
        </div>
        <ExpandMoreIcon />
      </div>
      {Object.keys(info).map((vendorName) => (
        <InputLabelKit key={vendorName} className={`accordion-dropdown ${active ? 'active' : ''}`}>
          <div>
            <CheckboxKit
              checked={
                chainObj[chainName]?.checked ? true : chainObj[chainName][vendorName]?.checked
              }
              onChange={(e) => handleChangeVendor(e, chainName)}
              value={vendorName}
              onClick={(e) => e.stopPropagation()}
            />
            {vendorName}
          </div>
        </InputLabelKit>
      ))}
    </div>
  );
};

export default RestaurantCheckboxAccordion;
