/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import './Cost.scss';
import DropdownSnackbar from './DropdownSnackbar';
import Invoice from './invoice/Invoice';

import useCost from '../../../hooks/useCost';
import useVendors from '../../../hooks/useVendors';

import SpinnerKit from '../../../kits/spinner/SpinnerKit';

const Cost = () => {
  const queryClient = useQueryClient();
  const [invoice, setInvoice] = useState([]);
  const { vendors } = useVendors();
  const { vendorsObj } = vendors;

  const { load, save } = useCost(vendorsObj);

  const { data, isLoading, isError } = useQuery(['loadCost'], load);

  const mutateInvoice = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadCost'] });
    },
  });

  if (isLoading)
    return <SpinnerKit style={{ display: 'flex', margin: 'auto', justifyContent: 'center' }} />;

  if (isError)
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error Occured</div>;

  const handleAdd = async (cost, v) => {
    await mutateInvoice.mutateAsync({ cost, vendors: v });
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
        {invoice?.map((obj, index) => (
          <Invoice
            key={obj.id}
            setInvoice={setInvoice}
            invoice={data}
            index={index}
            restaurant={obj.restaurant}
            cost={obj.cost}
          />
        ))}
      </div>
    </div>
  );
};

export default Cost;
