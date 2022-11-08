import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import talabat from '../../assets/images/talabat-favicon.png';
import InputLabelKit from '../../kits/inputlabel/InputLabelKit';
import deliveroo from '../../assets/images/deliveroo-favicon.webp';

const RestaurantCheckboxAccordion = ({ info, handleChangeChain, restaurants }) => {
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
            src={info.platform === 'deliveroo' ? deliveroo : talabat}
            alt={info.platform}
          />
          <CheckboxKit
            checked={restaurants.indexOf(info.chain_id) > -1}
            onClick={(e) => e.stopPropagation()}
            value={info.chain_id}
            onChange={(e) => handleChangeChain(e, info.platform)}
          />
          {info.data.chain_name}
        </div>
        <ExpandMoreIcon />
      </div>
      <div className={`accordion-dropdown ${active ? 'active' : ''}`}>
        <InputLabelKit>
          <CheckboxKit
            checked={restaurants.indexOf(info.chain_id) > -1}
            onChange={(e) => handleChangeChain(e, info.platform)}
            value={info.chain_id}
          />
          {info.data.vendor_name}
        </InputLabelKit>
      </div>
    </div>
  );
};

export default RestaurantCheckboxAccordion;
