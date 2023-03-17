import { Button, Checkbox, Empty, List, Space } from 'antd';
import { FC, ReactNode } from 'react';
import './ChildrenList.scss';

type Value = number | string;

type Item = {
  value: Value;
  title: ReactNode;
  subTitle?: ReactNode;
  disabled?: boolean;
  checked: boolean;
  extra?: ReactNode;
};

const Title: FC<{ value: ReactNode }> = ({ value }) => (
  <span className='vendors-select-title'>{value.toString().split('_')[0]}</span>
);

const SubTitle: FC<{ value: ReactNode }> = ({ value }) => (
  <span className='vendors-select-sub-title'>{value.toString().split('_')[0]}</span>
);

const ChildrenListItem: FC<{
  item: Item;
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
}> = ({ item, onSelect, onSelectOnly }) => (
  <List.Item className={`list-item ${item.checked && 'checked'}`}>
    <div className='children-list-item-container'>
      <div>
        <Checkbox
          checked={item.checked}
          onChange={(v) => onSelect(v.target.checked, item.value)}
          disabled={item.disabled}
        />
        <Space className='children-space' size={0} direction='vertical'>
          <Title value={item.title} />
          {item.subTitle && <SubTitle value={item.subTitle} />}
        </Space>
      </div>
      <Button
        className='list-item-select-only'
        type='text'
        onClick={() => onSelectOnly(item.value)}
        disabled={item.disabled}
      >
        Select Only
      </Button>
      {item.extra}
    </div>
  </List.Item>
);

export const ChildrenList: FC<{
  items: Item[];
  onSelect: (v: boolean, value: Value) => void;
  onSelectOnly: (value: Value) => void;
}> = ({ items, onSelect, onSelectOnly }) => {
  if (items.length === 0) {
    return (
      <Empty
        description='Select a brand to see the list of branches'
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <List
      className='children-list'
      dataSource={items}
      renderItem={(item) => (
        <ChildrenListItem item={item} onSelect={onSelect} onSelectOnly={onSelectOnly} />
      )}
    />
  );
};
