import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DropdownSnackbar from 'components/dropdownSnackbar/DropdownSnackbar';
import { useCost, useVendors } from 'hooks';
import { SpinnerKit } from 'kits';
import { useState } from 'react';
import './Cost.scss';
import Invoice from './invoice/Invoice';

type TInvoice = {
  id: string;
  restaurant: string;
  cost: string;
};

const Cost = () => {
  const queryClient = useQueryClient();
  const [invoice, setInvoice] = useState<TInvoice[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const { vendors } = useVendors(false);

  const { vendorsObj, vendorsArr } = vendors;
  const { load, save } = useCost(vendorsObj);

  const { isLoading, isError } = useQuery(['loadCost', { vendors }], load, {
    onSuccess: (data) => {
      const newInvoice: TInvoice[] = [];
      Object.keys(data).forEach((platform) => {
        Object.keys(data[platform]).forEach((id) => {
          if (data[platform][id]) {
            const element = vendorsObj[platform].find(
              (vobj) => String(vobj.vendor_id) === String(id)
            );

            if (!element) return;

            const currentCost = data[platform][id]?.cost || null;

            if (!currentCost) return;

            const percent = parseFloat(currentCost) * 100;

            const res = {
              id,
              restaurant: element.data.vendor_name,
              cost: `${percent}%`,
            };

            newInvoice.push(res);
          }
        });
      });
      setInvoice(newInvoice);
    },
    enabled: Object.keys(vendorsObj).length > 0,
    staleTime: Infinity,
  });

  const { isLoading: isLoadingMutation, mutateAsync } = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadCost', { vendors }] });
    },
  });

  if (isError)
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error Occured</div>;

  const handleAdd = async (cost, v) => {
    await mutateAsync({ cost: parseFloat(cost), vendors: v });
  };

  const deleteCost = (index, vendorId) => async () => {
    const clonedInvoice = [...invoice];
    clonedInvoice.splice(index, 1);

    const element = vendorsArr.find((vobj) => String(vobj.vendor_id) === String(vendorId));

    const { platform, ...rest } = element;

    await mutateAsync({ cost: null, vendors: { [platform]: [{ ...rest }] } });

    setInvoice(clonedInvoice);
  };

  const renderContent = () => {
    if (isLoading || isLoadingMutation)
      return <SpinnerKit style={{ display: 'flex', margin: 'auto', justifyContent: 'center' }} />;

    return invoice?.map((obj, index) => (
      <Invoice
        key={obj.id}
        onDelete={deleteCost(index, obj.id)}
        restaurant={obj.restaurant}
        cost={obj.cost}
      />
    ));
  };

  return (
    <div className='billing'>
      <div className='billing__invoice __card'>
        <div className='__flex'>
          <div className='__head'>
            <p className='billing__card-title'>Your Cost Information</p>
            {/* <p className="billing__card-subtitle">- -</p> */}
          </div>
        </div>
        <DropdownSnackbar
          onAdd={handleAdd}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          invoice={invoice}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default Cost;
