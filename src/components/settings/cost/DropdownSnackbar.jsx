import React, { useEffect, useState } from 'react';

import ButtonKit from '../../../kits/button/ButtonKit';
import RestaurantDropdown from '../../restaurantDropdown/RestaurantDropdown.suspended';
import CompetitionDropdown from '../../competitionDropdown/CompetitionDropdown';
import { usePlatform } from '../../../hooks/usePlatform';
import useVendors from '../../../hooks/useVendors';
import RestaurantDropdownOld from '../../restaurantDropdown/RestaurantDropdownOld';

const DropdownSnackbar = (props) => {
  const { onAdd } = props;
  const { vendors } = useVendors();
  const [costVendors, setCostVendors] = useState(JSON.parse(JSON.stringify(vendors)));
  const [procent, setProcent] = useState('');
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
    const newChainObj = JSON.parse(JSON.stringify(vendors.chainObj));
    const newVendorsObj = { talabat: [], deliveroo: [] };
    if (Object.keys(vendors.chainObj).length > 0) {
      if (Object.keys(vendors.display).length > 0) {
        Object.keys(newChainObj).forEach((chainName, index) => {
          Object.keys(newChainObj[chainName]).forEach((vendorName) => {
            if (index !== 0) {
              delete newChainObj[chainName][vendorName];
            } else {
              platform.forEach((p) => {
                newVendorsObj[p]?.push(newChainObj[chainName][vendorName][p]);
              });
            }
          });
        });
        setCostVendors({
          ...costVendors,
          vendorsObj: newVendorsObj,
          chainObj: newChainObj,
        });
      } else {
        newVendorsObj[platform[0]] = [vendors.vendorsObj[platform[0]][0]];
        setCostVendors({
          ...costVendors,
          restaurants: [vendors.restaurants[0]],
          vendorsObj: newVendorsObj,
        });
      }
    }
  }, [vendors]);
  const addCost = () => {
    const clonedInvoice = [];
    // TODO: check if it handle multiple selection of vendors
    if (procent) {
      if (Object.values(costVendors.chainObj).length > 0) {
        Object.keys(costVendors.chainObj).forEach((cName) => {
          Object.keys(costVendors.chainObj[cName]).forEach((vName) => {
            clonedInvoice.push({ restaurant: vName, cost: procent, id: `${vName}_${procent}` });
          });
        });
      }
    }

    setProcent('');
    onAdd(procent, costVendors.vendorsObj);
  };
  return (
    <div className="invoice snackbar">
      <div className="snackbar-wrapper">
        {Object.keys(vendors.display).length > 0 ? (
          <RestaurantDropdown
            setState={setCostVendors}
            state={costVendors}
            cost
            platforms={platform}
            chainObj={costVendors.chainObj}
          />
        ) : (
          <RestaurantDropdownOld
            restaurants={costVendors.restaurants}
            vendors={costVendors.vendorsArr.filter((v) => platform.find((p) => v.platform === p))}
            vendorsPlatform={Object.keys(costVendors.vendorsObj)}
            setState={setCostVendors}
            state={costVendors}
            cost
          />
        )}
        <CompetitionDropdown
          rows={['5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%']}
          setRow={setProcent}
          select={procent}
          title="Select your Cost %"
          className="snackbar-procent"
        />
      </div>
      <ButtonKit disabled={!procent} onClick={addCost} className="snackbar-btn" variant="contained">
        Add
      </ButtonKit>
    </div>
  );
};

export default DropdownSnackbar;
