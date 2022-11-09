import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import selectIcon from '../../assets/images/ic_select.png';

const RestaurantCheckboxAccordion = ({
  info,
  chainName,
  chainArr,
  handleChange,
  handleChangeVendor,
}) => {
  const [active, setActive] = useState(false);
  return (
    <div className={`checkbox-accordion-wrapper ${active ? 'active' : ''}`}>
      <div
        tabIndex={-1}
        role="presentation"
        className={`checkbox-accordion ${active ? 'active' : ''}`}
        onClick={() => setActive(!active)}
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
            checked={chainArr.indexOf(chainName) > -1}
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
              checked={Object.keys(info).indexOf(vendorName) > -1}
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
