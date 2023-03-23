/* eslint-disable react/require-default-props */
import { Button, Checkbox, Empty, List, Space } from 'antd';
import { FC, ReactNode } from 'react';
import { ReactComponent as ArrowRightIcon } from './arrow-right.svg';
import './ParentList.scss';

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
  subTitle?: ReactNode;
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
    onClick={() => !item.disabled && setSelected(item.value)}
    className={`list-item ${item.checked && 'checked'} ${item.disabled && 'disabled'}`}
  >
    <div className='parent-list-item-container'>
      <div>
        <Checkbox
          checked={item.checked}
          indeterminate={item.intermediate}
          onChange={(v) => onSelect(v.target.checked, item.value)}
          onClick={(e) => e.stopPropagation()}
          disabled={item.disabled}
        />
        <Space className='parent-space' size={0} direction='vertical'>
          <Title value={item.title} />
          {item.subTitle && <SubTitle value={item.subTitle} />}
        </Space>
      </div>
      <div className='action-buttons'>
        <Button
          className='list-item-select-only'
          type='text'
          onClick={(e) => {
            e.stopPropagation();
            onSelectOnly(item.value);
          }}
          disabled={item.disabled}
        >
          Only
        </Button>
        <Button type='text' disabled={item.disabled} className='expand-button'>
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
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
