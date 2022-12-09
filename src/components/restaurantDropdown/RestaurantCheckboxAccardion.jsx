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
  branch,
  cost,
}) => {
  const [active, setActive] = useState(false);
  const getChecked = () =>
    Object.values(chainObj[chainName] || {}).length === Object.values(info).length;
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
          {chainName}
        </div>
        <ExpandMoreIcon />
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
            {vendorName}
          </div>
        </InputLabelKit>
      ))}
    </div>
  );
};

export default RestaurantCheckboxAccordion;
