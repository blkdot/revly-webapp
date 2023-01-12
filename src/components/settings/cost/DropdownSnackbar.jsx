import React, { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { vendorsAtom } from '../../../store/vendorsAtom';
import ButtonKit from '../../../kits/button/ButtonKit';
import RestaurantDropdownNew from '../../restaurantDropdown/RestaurantDropdownNew';
import { usePlatform } from '../../../hooks/usePlatform';
import RestaurantDropdownOld from '../../restaurantDropdown/RestaurantDropdownOld';
import useVendors from '../../../hooks/useVendors';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';

const DropdownSnackbar = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { onAdd, isUpdate, setIsUpdate, invoice } = props;
  const [vendors, setVendors] = useAtom(vendorsAtom);
  const { vendors: vendorsReq } = useVendors();
  useEffect(() => {
    if (vendorsReq.vendorsArr.length < 0) {
      setVendors(vendorsReq);
    }
  }, [vendorsReq]);
  const [costVendors, setCostVendors] = useState(JSON.parse(JSON.stringify(vendors)));
  const [procent, setProcent] = useState(0);
  const { userPlatformData } = usePlatform();
  const getPlatformActive = () => {
    if (userPlatformData.platforms.talabat.active && userPlatformData.platforms.deliveroo.active) {
      return ['talabat', 'deliveroo'];
    }
    if (userPlatformData.platforms.talabat.active) {
      return ['talabat'];
    }

    return ['deliveroo'];
  };
  const platform = getPlatformActive();
  useEffect(() => {
    const newChainObj = {};
    const newVendorsObj = { talabat: [], deliveroo: [] };
    if (Object.keys(vendors.display).length > 0) {
      Object.keys(vendors.display).forEach((chainName, index) => {
        Object.keys(vendors.display[chainName]).forEach((vendorName) => {
          if (index === 0) {
            newChainObj[chainName] = {
              ...newChainObj[chainName],
              [vendorName]: { ...vendors.display[chainName][vendorName] },
            };
            platform.forEach((p) => {
              newVendorsObj[p]?.push(vendors.display[chainName][vendorName][p]);
            });
          }
        });
      });
      setCostVendors({
        ...vendors,
        vendorsObj: newVendorsObj,
        chainObj: newChainObj,
      });
    } else {
      newVendorsObj[platform[0]] = [(vendors.vendorsObj[platform[0]] || [])[0]];
      setCostVendors({
        ...vendors,
        vendorsSelected: [vendors.vendorsSelected[0]],
        vendorsObj: newVendorsObj,
      });
    }
  }, [vendors]);

  useEffect(() => {
    const { vendorsObj } = costVendors;

    Object.keys(vendorsObj).forEach((p) => {
      const selected = vendorsObj[p].some((obj) => {
        // eslint-disable-next-line eqeqeq
        const index = invoice.findIndex((inv) => inv.id == obj.vendor_id);
        return index > -1;
      });

      if (selected) {
        setIsUpdate(selected);
        return;
      }

      setIsUpdate(false);
    });
  }, [costVendors]);

  const addCost = () => {
    setProcent('');
    const strCost = procent.replace('%', '');

    const numCost = parseInt(strCost, 10);

    const numDecimalCost = parseFloat(numCost / 100);

    onAdd(numDecimalCost, costVendors.vendorsObj);
  };

  const handleChangeCost = ({ target }) => {
    const { value } = target;

    setProcent((prev) => {
      if (Number.isNaN(value)) return prev;

      if (value < 0) return prev;

      if (value > 100) return prev;

      if (value % 1 !== 0) return prev;

      return value;
    });
  };
  return (
    <div className="invoice snackbar">
      <div className="snackbar-wrapper">
        {Object.keys(vendors.display).length > 0 ? (
          <RestaurantDropdownNew
            setState={setCostVendors}
            state={costVendors}
            cost
            platforms={platform}
            chainObj={costVendors.chainObj}
          />
        ) : (
          <RestaurantDropdownOld
            vendorsSelected={costVendors.vendorsSelected}
            vendors={costVendors.vendorsArr.filter((v) => platform.find((p) => v.platform === p))}
            setState={setCostVendors}
            state={costVendors}
            cost
          />
        )}
        <TextfieldKit
          size="small"
          label="Type your Cost %"
          className="snackbar-input-cost"
          type="number"
          value={procent}
          onChange={handleChangeCost}
        />
      </div>
      <ButtonKit disabled={!procent} onClick={addCost} className="snackbar-btn" variant="contained">
        {isUpdate ? 'Update' : 'Add'}
      </ButtonKit>
    </div>
  );
};

export default DropdownSnackbar;
