import { Button, DatePicker, Divider, Space, TreeSelect, Typography } from 'antd';
import { useVendorsV2 } from 'api/hooks';
import deliveroo from 'assets/images/deliveroo-favicon.webp';
import talabat from 'assets/images/talabat-favicon.png';
import { useDates } from 'contexts';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { DisplayVendor } from 'types';
import './Test.scss';

const TreeVendor: FC<{
  name: string;
  vendor: DisplayVendor;
}> = ({ name, vendor }) => (
  <Space>
    {name}
    {vendor.platforms.deliveroo && <img alt='deliveroo' src={deliveroo} className='platform-img' />}
    {vendor.platforms.talabat && <img alt='talabat' src={talabat} className='restaurant-img' />}
  </Space>
);

export const Test: FC = () => {
  const response = useVendorsV2();

  const [selected, setSelected] = useState<string[]>([]);

  const tree = useMemo(() => {
    const out = [];

    Object.entries(response.data?.display || []).forEach(([ik, iv]) => {
      if (ik === '') {
        return;
      }

      out.push({
        title: ik,
        value: ik,
        label: ik,
        key: ik,
        children: Object.entries(iv).map(([jk, jv], j) => ({
          title: <TreeVendor name={jk} vendor={jv as any} />,
          label: jk,
          value: `${jk}-${j}`,
          key: `${jk}-${j}`,
        })),
      });
    });

    // keep vendors without chain at the end
    Object.entries(response.data?.display[''] || []).forEach(([k, v], j) => {
      out.push({
        title: <TreeVendor name={k} vendor={v as any} />,
        label: k,
        value: `${k}-${j}`,
        key: `${k}-${j}`,
      });
    });

    return out;
  }, [response.data]);

  // TODO: fix type

  const { current: before, compare: after } = useDates();

  /* today, yesterday, current week, last week, curren month, last month */
  const presets: {
    label: string;
    value: [Dayjs, Dayjs];
  }[] = [
    {
      label: 'Today',
      value: [dayjs().startOf('day'), dayjs().endOf('day')],
    },
    {
      label: 'Yesterday',
      value: [dayjs().add(-1, 'day').startOf('day'), dayjs().add(-1, 'day').endOf('day')],
    },
    {
      label: 'Current Week',
      value: [dayjs().startOf('week'), dayjs().endOf('day')],
    },
    {
      label: 'Last Week',
      value: [dayjs().add(-1, 'week').startOf('week'), dayjs().add(-1, 'week').endOf('week')],
    },
    {
      label: 'Current Month',
      value: [dayjs().startOf('month'), dayjs().endOf('day')],
    },
    {
      label: 'Last Month',
      value: [dayjs().add(-1, 'month').startOf('month'), dayjs().add(-1, 'month').endOf('month')],
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <TreeSelect<string[]>
        multiple
        treeCheckable
        loading={response.isLoading}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        treeNodeLabelProp='label'
        treeData={tree}
        style={{ width: 400 }}
        // eslint-disable-next-line react/no-unstable-nested-components
        dropdownRender={(menu) => (
          <Space direction='vertical' style={{ width: '100%' }}>
            {menu}
            <Divider style={{ margin: 0, padding: 0 }} />
            <Space>
              <Typography.Text>Selected: {selected.length}</Typography.Text>
              <Button type='primary'>Select All</Button>
            </Space>
          </Space>
        )}
        onChange={setSelected}
      />
      <DatePicker.RangePicker presets={presets} onChange={console.log} />
      <DatePicker.RangePicker presets={presets} onChange={console.log} />
    </div>
  );
};
