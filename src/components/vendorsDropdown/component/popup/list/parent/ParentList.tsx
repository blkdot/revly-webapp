/* eslint-disable react/require-default-props */
import { Button, Checkbox, Empty, List, Space } from 'antd';
import { FC, ReactNode } from 'react';
import { ReactComponent as ArrowRight } from './arrow-right.svg';

const Title: FC<{ value: ReactNode }> = ({ value }) => (
  <span className='vendors-select-title'>{value}</span>
);

const SubTitle: FC<{ value: ReactNode }> = ({ value }) => (
  <span className='vendors-select-sub-title'>{value}</span>
);

type Value = number | string;

type Item = {
  value: Value;
  title: ReactNode;
  subTitle: ReactNode;
  disabled?: boolean;
  checked: boolean;
  intermediate: boolean;
};

const ParentListItem: FC<{
  item: Item;
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
  setSelected: (v: Value) => void;
}> = ({ item, onSelect, onSelectOnly, setSelected }) => (
  <List.Item
    extra={
      <Button type='text' onClick={() => setSelected(item.value)} disabled={item.disabled}>
        <ArrowRight />
      </Button>
    }
  >
    <Checkbox
      checked={item.checked}
      indeterminate={item.intermediate}
      onChange={(v) => onSelect(v.target.checked, item.value)}
      disabled={item.disabled}
    >
      <Space size={0} direction='vertical'>
        <Title value={item.title} />
        <SubTitle value={item.subTitle} />
      </Space>
    </Checkbox>
    <Button type='text' onClick={() => onSelectOnly(item.value)} disabled={item.disabled}>
      Select Only
    </Button>
  </List.Item>
);

export const ParentList: FC<{
  items: Item[];
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
  setSelected: (v: Value) => void;
}> = ({ items, onSelect, onSelectOnly, setSelected }) => {
  if (items.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <List
      className='parent-list'
      dataSource={items}
      renderItem={(item) => (
        <ParentListItem
          item={item}
          onSelect={onSelect}
          onSelectOnly={onSelectOnly}
          setSelected={setSelected}
        />
      )}
    />
  );
};
