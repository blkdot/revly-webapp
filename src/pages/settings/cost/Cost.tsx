import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DropdownSnackbar from 'components/dropdownSnackbar/DropdownSnackbar';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
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

  const { vendorsObj } = vendors;
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

  const headers = [
    {
      id: 'chain_id',
      numeric: false,
      disablePadding: false,
      label: 'Chain name',
    },
    {
      id: 'vendor_ids',
      numeric: false,
      disablePadding: false,
      label: 'Number of branches',
    },
    {
      id: 'cost',
      numeric: false,
      disablePadding: true,
      label: 'Cost',
    },
  ];
  const { renderChainId, renderVendorId, renderSimpleRow, renderSimpleRowSkeleton } =
    useTableContentFormatter();
  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    cost: renderSimpleRow,
  };
  const renderRowsByHeader = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: r.platform,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoding = {
    platform: renderSimpleRowSkeleton,
    beforePeriod: renderSimpleRowSkeleton,
    evolution: renderSimpleRowSkeleton,
  };
  const renderRowsByHeaderLoading = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObjectLoding[cur.id](cur),
        id: r,
      }),
      {}
    );

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
        {/* <TableRevlyNew
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={isLoading || isLoadingMutation}
          headers={headers}
          rows={invoice.map(renderRowsByHeader)}
        /> */}
      </div>
    </div>
  );
};

export default Cost;
