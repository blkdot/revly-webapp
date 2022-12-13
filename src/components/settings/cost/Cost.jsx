/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import './Cost.scss';
import DropdownSnackbar from './DropdownSnackbar';
import Invoice from './invoice/Invoice';

import useCost from '../../../hooks/useCost';

import SpinnerKit from '../../../kits/spinner/SpinnerKit';
import useDate from '../../../hooks/useDate';

const Cost = () => {
  const queryClient = useQueryClient();
  const [invoice, setInvoice] = useState([]);
  const { vendors } = useDate();
  const { vendorsObj } = vendors;

  const { load, save } = useCost(vendorsObj);

  const { isLoading, isError } = useQuery(['loadCost'], load, {
    onSuccess: (data) => {
      const newInvoice = [];
      Object.keys(data).forEach((platform) => {
        Object.keys(data[platform]).forEach((id) => {
          if (data[platform][id]) {
            const element = vendorsObj[platform].find((vobj) => vobj.vendor_id == id);

            if (element) {
              const value = data[platform][id].cost;

              const percent = parseFloat(value, 36) * 100;

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
    await mutateAsync({ cost, vendors: v });
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
    <div className="billing">
      <div className="billing__invoice __card">
        <div className="__flex">
          <div className="__head">
            <p className="billing__card-title">Your Cost Information</p>
            <p className="billing__card-subtitle">
              Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
              vivamus risus.
            </p>
          </div>
        </div>
        <DropdownSnackbar onAdd={handleAdd} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Cost;
