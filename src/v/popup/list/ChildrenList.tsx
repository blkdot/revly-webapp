import { Button, Checkbox, List, Space } from 'antd';
import { FC } from 'react';

type Value = number | string;

type Item = {
  value: Value;
  title: string;
  subTitle: string;
  disabled?: boolean;
  checked: boolean;
};

const Title: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-title'>{value}</span>
);

const SubTitle: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-sub-title'>{value}</span>
);

const ChildrenListItem: FC<{
  item: Item;
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
}> = ({ item, onSelect, onSelectOnly }) => (
  <List.Item>
    <Checkbox
      checked={item.checked}
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

export const ChildrenList: FC<{
  items: Item[];
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
}> = ({ items, onSelect, onSelectOnly }) => (
  <List
    className='children-list'
    dataSource={items}
    renderItem={(item) => (
      <ChildrenListItem item={item} onSelect={onSelect} onSelectOnly={onSelectOnly} />
    )}
  />
);
