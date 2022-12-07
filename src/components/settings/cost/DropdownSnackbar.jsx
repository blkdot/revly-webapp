import React, { useEffect, useState } from 'react';

import ButtonKit from '../../../kits/button/ButtonKit';
import RestaurantDropdown from '../../restaurantDropdown/RestaurantDropdown.suspended';
import CompetitionDropdown from '../../competitionDropdown/CompetitionDropdown';
import { usePlatform } from '../../../hooks/usePlatform';
import useVendors from '../../../hooks/useVendors';
import RestaurantDropdownOld from '../../restaurantDropdown/RestaurantDropdownOld';

const DropdownSnackbar = ({ setInvoice, invoice }) => {
  const { vendors } = useVendors();
  const [costVendors, setCostVendors] = useState({ ...vendors });
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
    const newChainObj = { ...vendors.chainObj };
    const newVendorsObj = { talabat: [], deliveroo: [] };
    if (Object.keys(vendors.chainObj).length > 0) {
      // Object.keys(xxx).length will always be equal or greater than 0
      if (vendors.display) {
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
    const clonedInvoice = [...invoice];
    if (procent) {
      if (Object.values(costVendors.chainObj).length > 0) {
        Object.keys(costVendors.chainObj).forEach((cName) => {
          Object.keys(costVendors.chainObj[cName]).forEach((vName) => {
            clonedInvoice.push({ restaurant: vName, cost: procent, id: invoice.length + 1 });
          });
        });
      }
    }
    setProcent('');
    setInvoice(clonedInvoice);
  };
  return (
    <div className="invoice snackbar">
      <div className="snackbar-wrapper">
        {/* Object.keys(xxx).length will always be equal or greater than 0 */}
        {vendors.display ? (
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
