import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from 'components';
import useTableContentFormatter from 'components/tableRevly/tableContentFormatter/useTableContentFormatter';
import TableRevlyNew from 'components/tableRevly/TableRevlyNew';
import { useCost, useVendors } from 'hooks';
import { useAtom } from 'jotai';
import { ContainerKit } from 'kits';
import LodaingButtonKit from 'kits/loadingButton/LoadingButtonKit';
import { useEffect } from 'react';
import costAtom from 'store/costAtom';
import SettingsTopInputs from '../component/SettingsTopInputs';
import './Cost.scss';

const Cost = () => {
  const queryClient = useQueryClient();
  const { vendors, isLoading } = useVendors(false);
  const [cost, setCost] = useAtom(costAtom);
  const { vendorsObj, display, chainData } = vendors;
  const { save } = useCost(vendorsObj);
  const getDataVendors = (chainName: string) => {
    const dataVendorsObj = {};
    chainData
      .filter((obj) => obj.chain_name === chainName)
      .forEach((obj) => {
        if (dataVendorsObj[obj.platform]) {
          dataVendorsObj[obj.platform] = [...dataVendorsObj[obj.platform], obj.data];
        } else {
          dataVendorsObj[obj.platform] = [obj.data];
        }
      });
    return dataVendorsObj;
  };

  const data = Object.keys(display)
    .map((chainName) => ({
      chain_name: chainName,
      vendor_names: Object.keys(display[chainName]),
      cost:
        Number(chainData.find((obj) => obj.chain_name === chainName).data.metadata.cost) * 100 ||
        15,
      changed: false,
      vendors: getDataVendors(chainName),
    }))
    .filter((obj) =>
      Object.keys(display[obj.chain_name]).some((vName) => display[obj.chain_name][vName].active)
    )
    .map((obj) => ({
      ...obj,
      chain_name: obj.chain_name || 'In Process',
    }));
  useEffect(() => {
    setCost(data);
  }, [vendors]);
  const { isLoading: isLoadingMutation, mutateAsync } = useMutation({
    mutationFn: save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadCost', { vendors }] });
    },
  });
  const handleChange = async () => {
    await cost
      .filter((obj) => obj.changed)
      .forEach((obj) => {
        mutateAsync({ cost: Number(obj.cost) / 100, vendors: obj.vendors });
      });
    setCost(cost.map((obj) => ({ ...obj, changed: false })));
  };
  const headers = [
    {
      id: 'chain_name',
      numeric: false,
      disablePadding: false,
      label: 'Chain name',
      tooltip: 'Your brand name',
    },
    {
      id: 'vendor_names',
      numeric: false,
      disablePadding: false,
      label: 'Branches',
    },
    {
      id: 'cost',
      numeric: false,
      disablePadding: true,
      label: 'Cost',
    },
  ];
  const { renderRowTooltip, renderSimpleRowSkeleton, renderSimpleRow, renderCostRow } =
    useTableContentFormatter();
  const cellTemplatesObject = {
    chain_name: renderSimpleRow,
    vendor_names: renderRowTooltip,
    cost: renderCostRow,
  };
  const renderRowsByHeader = (r) =>
    headers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: r.chain_name,
        data: r,
      }),
      {}
    );
  const cellTemplatesObjectLoding = {
    chain_name: renderSimpleRowSkeleton,
    vendor_names: renderSimpleRowSkeleton,
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
    <div className='wrapper'>
      <SettingsTopInputs />
      <ContainerKit className='billing'>
        <div className='marketing-top'>
          <PageHeader
            title='Your Cost Information'
            description='Insert and update the average cost of food per chain to calculate your net revenue in the dashboard'
            extra={
              <LodaingButtonKit
                loading={isLoadingMutation}
                onClick={handleChange}
                variant='contained'
                disabled={!cost.some((obj) => obj.changed)}
                className='cost_btn'
              >
                Save changes
              </LodaingButtonKit>
            }
          />
        </div>
        <div className='__table-block'>
          <TableRevlyNew
            renderCustomSkelton={[0, 1, 2, 3, 4].map(renderRowsByHeaderLoading)}
            isLoading={isLoading}
            headers={headers}
            rows={cost.map(renderRowsByHeader)}
            className='onboarding-table'
          />
        </div>
      </ContainerKit>
    </div>
  );
};

export default Cost;
