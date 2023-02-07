import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit, TextfieldKit } from 'kits';
import { useEffect, useState } from 'react';
import { vendorsAtom } from '../../../store/vendorsAtom';

const DropdownSnackbar = (props: any) => {
  // eslint-disable-next-line no-unused-vars
  const { onAdd, isUpdate, setIsUpdate, invoice } = props;
  const [vendors, setVendors] = useAtom(vendorsAtom);
  const { vendors: vendorsReq } = useVendors(undefined);
  useEffect(() => {
    if (vendorsReq.vendorsArr.length < 0) {
      setVendors(vendorsReq);
    }
  }, [vendorsReq]);
  const [costVendors, setCostVendors] = useState(JSON.parse(JSON.stringify(vendors)));
  const [procent, setProcent] = useState<any>(0);
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    const vendorsObjTemp = JSON.parse(JSON.stringify(vendors.vendorsObj));
    Object.keys(displayTemp).forEach((chainName, indexC) => {
      Object.keys(displayTemp[chainName]).forEach((vendorName, indexV) => {
        if (indexC === 0 && indexV === 0) {
          displayTemp[chainName][vendorName].checked = true;
          Object.keys(displayTemp[chainName][vendorName].platforms).forEach((plat) => {
            vendorsObjTemp[plat] = [displayTemp[chainName][vendorName].platforms[plat]];
          });
        } else {
          displayTemp[chainName][vendorName].checked = false;
        }
      });
    });
    setCostVendors({
      ...vendors,
      display: displayTemp,
      vendorsObj: vendorsObjTemp,
    });
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

    const numDecimalCost = parseFloat((numCost / 100).toString());

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
    <div className='invoice snackbar'>
      <div className='snackbar-wrapper'>
        <RestaurantDropdown
          className='snackbar-dropdown'
          state={costVendors}
          setState={setCostVendors}
          cost
        />
        <TextfieldKit
          size='small'
          label='Type your Cost %'
          className='snackbar-input-cost'
          type='number'
          value={procent}
          onChange={handleChangeCost}
        />
      </div>
      <ButtonKit disabled={!procent} onClick={addCost} className='snackbar-btn' variant='contained'>
        {isUpdate ? 'Update' : 'Add'}
      </ButtonKit>
    </div>
  );
};

export default DropdownSnackbar;
