import React, { useEffect, useState } from 'react';

import ButtonKit from '../../../kits/button/ButtonKit';
import RestaurantDropdown from '../../restaurantDropdown/RestaurantDropdown.suspended';
import CompetitionDropdown from '../../competitionDropdown/CompetitionDropdown';
import { usePlatform } from '../../../hooks/usePlatform';
import useVendors from '../../../hooks/useVendors';

const DropdownSnackbar = ({ setInvoice, invoice }) => {
  const { vendors } = useVendors();
  const [costVendors, setCostVendors] = useState(JSON.parse(JSON.stringify(vendors)));
  const [procent, setProcent] = useState('');
  const { userPlatformData } = usePlatform();
  const platform = [userPlatformData.platforms.talabat.active ? 'talabat' : 'deliveroo'];
  useEffect(() => {
    const newChainObj = JSON.parse(JSON.stringify(vendors.chainObj));
    const chainObjTemp = JSON.parse(JSON.stringify(vendors.chainObj));
    const newVendorsObj = { talabat: [], deliveroo: [] };
    const newVendorsArr = [];
    const newRestaurants = [];
    if (Object.keys(vendors.chainObj).length > 0) {
      Object.keys(newChainObj).forEach((chainName, index) => {
        if (index !== 0) {
          Object.keys(newChainObj[chainName]).forEach((vendorName) => {
            delete newChainObj[chainName][vendorName];
          });
        }
      });
      Object.keys(newChainObj).forEach((cName) => {
        Object.keys(newChainObj[cName]).forEach((vName) => {
          platform.forEach((p) => {
            newVendorsObj[p]?.push(newChainObj[cName][vName][p]);
          });
        });
      });
      Object.keys(chainObjTemp).forEach((cName) => {
        Object.keys(chainObjTemp[cName]).forEach((vName) => {
          platform.forEach((p) => {
            newVendorsArr?.push({ ...chainObjTemp[cName][vName][p], platform: p });
            newRestaurants?.push(chainObjTemp[cName][vName][p].data.vendor_name);
          });
        });
      });
    }
    setCostVendors({
      ...vendors,
      restaurants: newRestaurants,
      vendorsArr: newVendorsArr,
      vendorsObj: newVendorsObj,
      chainObj: newChainObj,
    });
  }, [vendors]);
  const addCost = () => {
    if (procent) {
      if (Object.values(costVendors.chainObj).length > 0) {
        Object.keys(costVendors.chainObj).forEach((cName) => {
          Object.keys(costVendors.chainObj[cName]).forEach((vName) => {
            setInvoice([...invoice, { restaurant: vName, cost: procent, id: invoice.length + 1 }]);
            setProcent('');
          });
        });
      }
    }
  };
  return (
    <div className="invoice snackbar">
      <div className="snackbar-wrapper">
        <RestaurantDropdown
          platforms={platform}
          chainObj={costVendors.chainObj}
          cost
          setState={setCostVendors}
          state={costVendors}
        />
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
