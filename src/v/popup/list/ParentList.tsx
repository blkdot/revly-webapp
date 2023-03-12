import { ArrowRight } from '@mui/icons-material';
import { Button, Checkbox, List, Space } from 'antd';
import { FC } from 'react';

const Title: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-title'>{value}</span>
);

const SubTitle: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-sub-title'>{value}</span>
);

type Value = number | string;

type Item = {
  value: Value;
  title: string;
  subTitle: string;
  disabled?: boolean;
  checked: boolean;
  intermediate: boolean;
};

const ParentListItem: FC<{
  item: Item;
  index: number;
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
  setSelected: (v: number) => void;
}> = ({ item, index, onSelect, onSelectOnly, setSelected }) => (
  <List.Item
    extra={
      <Button type='text' onClick={() => setSelected(index)} disabled={item.disabled}>
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
  setSelected: (v: number) => void;
}> = ({ items, onSelect, onSelectOnly, setSelected }) => (
  <List
    className='parent-list'
    dataSource={items}
    renderItem={(item, index) => (
      <ParentListItem
        item={item}
        index={index}
        onSelect={onSelect}
        onSelectOnly={onSelectOnly}
        setSelected={setSelected}
      />
    )}
  />
);
