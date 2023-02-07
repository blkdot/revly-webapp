/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCost, useVendors } from 'hooks';
import { SpinnerKit } from 'kits';
import { useState } from 'react';
import DropdownSnackbar from './DropdownSnackbar';
import Invoice from './invoice/Invoice';

const Cost = () => {
  const queryClient = useQueryClient();
  const [invoice, setInvoice] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const { vendors } = useVendors(undefined);
  const { vendorsObj } = vendors;

  const { load, save } = useCost(vendorsObj);

  const { isLoading, isError } = useQuery(['loadCost', { vendors }], load, {
    onSuccess: (data) => {
      const newInvoice = [];
      Object.keys(data).forEach((platform) => {
        Object.keys(data[platform]).forEach((id) => {
          if (data[platform][id]) {
            const element = vendorsObj[platform].find((vobj) => vobj.vendor_id == id);

            if (element) {
              const value = data[platform][id].cost;

              const percent = parseFloat(value) * 100;

              const res = {
                id,
                restaurant: element.data.vendor_name,
                cost: `${percent}%`,
              };

              newInvoice.push(res);
            }
          }
        });
      });
      setInvoice(newInvoice);
    },
  });

  const { isLoading: isLoadingMutation, mutateAsync } = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadCost'] });
    },
  });

  if (isError)
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error Occured</div>;

  const handleAdd = async (cost, v) => {
    await mutateAsync({ cost: parseFloat(cost), vendors: v });
  };

  const deleteCost = (index) => () => {
    const clonedInvoice = [...invoice];
    clonedInvoice.splice(index, 1);
    setInvoice(clonedInvoice);
  };

  const renderContent = () => {
    if (isLoading || isLoadingMutation)
      return <SpinnerKit style={{ display: 'flex', margin: 'auto', justifyContent: 'center' }} />;

    return invoice?.map((obj, index) => (
      <Invoice
        key={obj.id}
        onDelete={deleteCost(index)}
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
