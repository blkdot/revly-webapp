import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useCost, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { useEffect, useState } from 'react';
import costAtom from 'store/costAtom';
import './Cost.scss';

type TInvoice = {
  chain_id: string;
  vendor_ids: string[];
  cost: number;
  id: string;
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
              chain_id: String(element.chain_id),
              vendor_ids: Object.keys(data[platform]).filter((dId) => dId === element.vendor_id),
              cost: percent,
              id,
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
  const getChainIds = () => {
    const arr = []
    Object.keys(vendorsObj).forEach((plat) => {
      vendorsObj[plat].forEach((obj) => {
        if(obj.data.chain_name){
          arr.push(obj.chain_id)
        }
      })
    })
    return Array.from(new Set(arr))
  }
  const getVendorIds = (id) => {
    const arr = []
    Object.keys(vendorsObj).forEach((plat) => {
      vendorsObj[plat].forEach((obj) => {
        if (obj.chain_id === id && obj.metadata.is_active) {
          arr.push(obj.vendor_id)
        }
      })
    })
    return arr
  }

  const data = getChainIds().map((chain_id) => ({
    chain_id,
    vendor_ids: getVendorIds(chain_id),
    cost: 15,
    changed: false,
  }))
  const [cost, setCost] = useAtom(costAtom);
  useEffect(() => {
    setCost(data)
  }, [isLoading])
  const { isLoading: isLoadingMutation, mutateAsync } = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadCost', { vendors }] });
    },
  });

  if (isError)
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Error Occured</div>;

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
  const { renderChainId, renderVendorId, renderSimpleRow, renderSimpleRowSkeleton, renderCostRow } =
    useTableContentFormatter();
  const cellTemplatesObject = {
    chain_id: renderChainId,
    vendor_ids: renderVendorId,
    cost: renderCostRow,
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
    chain_id: renderSimpleRowSkeleton,
    vendor_ids: renderSimpleRowSkeleton,
    cost: renderSimpleRowSkeleton,
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
          <div className='__head cost'>
            <div>
              <p className='billing__card-title'>Your Cost Information</p>
              <span>Insert and update the average cost of food per chain to calculate your net revenue in the dashboard</span>
            </div>
            <ButtonKit variant='contained' disabled={!cost.some((obj) => obj.changed)}>
              Save changes
            </ButtonKit>
          </div>
        </div>
        <TableRevlyNew
          renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
          isLoading={isLoading || isLoadingMutation}
          headers={headers}
          rows={data.map(renderRowsByHeader)}
          className='competition-alerts'
        />
      </div>
    </div>
  );
};

export default Cost;
