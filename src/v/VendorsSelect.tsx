/* eslint-disable react/require-default-props */
import { ArrowRightAlt, Search } from '@mui/icons-material';
import { Button, Checkbox, Divider, Input, List, Popover, Space, Typography } from 'antd';
import { FC, useMemo, useState } from 'react';
import './VendorsSelect.scss';

const copy = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;

const generate = (): State =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
    value: i,
    title: i.toString(),
    subTitle: '10 Branches',
    checked: false,
    intermediate: false,
    disabled: i % 3 === 0,
    children: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => ({
      value: i * 10 + j,
      title: `${i.toString().repeat(5)}-${j}`,
      subTitle: `${i.toString().repeat(5)}-${j}`,
      checked: false,
      disabled: j % 4 === 0,
    })),
  }));

type Value = number | string;

const Title: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-title'>{value}</span>
);

const SubTitle: FC<{ value: string }> = ({ value }) => (
  <span className='vendors-select-sub-title'>{value}</span>
);

type Option = {
  value: Value;
  title: string;
  subTitle: string;
  disabled?: boolean;
  children: {
    value: Value;
    title: string;
    subTitle: string;
    disabled?: boolean;
  }[];
};

type State = {
  value: Value;
  title: string;
  subTitle: string;
  checked: boolean;
  intermediate: boolean;
  disabled?: boolean;
  children: {
    value: Value;
    title: string;
    subTitle: string;
    checked: boolean;
    disabled?: boolean;
  }[];
}[];

const clean = (state: State): State => {
  const newState = copy(state);

  newState.forEach((a, i) => {
    newState[i].checked = false;
    newState[i].intermediate = false;
    a.children.forEach((b, j) => {
      newState[i].children[j].checked = false;
    });
  });

  return newState;
};

export const VendorsSelect: FC<{
  values?: Value[];
  options?: Option[];
  onChange?: (v: Value[]) => void;
}> = ({ values, options, onChange }) => {
  const [selected, setSelected] = useState(-1);
  const [state, setState] = useState(generate());
  const [search, setSearch] = useState('');

  const selectParent = (v: boolean, value: Value) => {
    setState((p) => {
      const index = p.findIndex((i) => i.value === value);
      setSelected(index);

      const newState = copy(p);
      newState[index].checked = v;
      newState[index].intermediate = false;
      newState[index].children.forEach((_, j) => {
        if (!newState[index].children[j].disabled) {
          newState[index].children[j].checked = v;
        }
      });

      return newState;
    });
  };

  const selectOnlyParent = (value: Value) => {
    setState((p) => {
      const index = p.findIndex((i) => i.value === value);
      setSelected(index);

      const newState = clean(p);
      newState[index].checked = true;
      newState[index].children.forEach((_, j) => {
        if (!newState[index].children[j].disabled) {
          newState[index].children[j].checked = true;
        }
      });

      return newState;
    });
  };

  const selectChild = (v: boolean, value: Value) => {
    setState((p) => {
      const index = p[selected].children.findIndex((i) => i.value === value);

      const newState = copy(p);
      newState[selected].children[index].checked = v;
      if (newState[selected].children.every((c) => c.checked)) {
        newState[selected].checked = true;
        newState[selected].intermediate = false;
      } else {
        newState[selected].checked = false;
        newState[selected].intermediate = newState[selected].children.some((c) => c.checked);
      }

      return newState;
    });
  };

  const selectOnlyChild = (value: Value) => {
    setState((p) => {
      const index = p[selected].children.findIndex((i) => i.value === value);

      const newState = clean(p);
      newState[selected].children[index].checked = true;
      if (newState[selected].children.every((c) => c.checked)) {
        newState[selected].checked = true;
        newState[selected].intermediate = false;
      } else {
        newState[selected].checked = false;
        newState[selected].intermediate = newState[selected].children.some((c) => c.checked);
      }

      return newState;
    });
  };

  const selectAll = (v: boolean) => {
    setState((p) => {
      const newState = clean(p);
      newState.forEach((a, i) => {
        if (!newState[i].disabled) {
          newState[i].checked = v;
        }
        newState[i].children.forEach((b, j) => {
          if (!newState[i].children[j].disabled) {
            newState[i].children[j].checked = v;
          }
        });
      });

      return newState;
    });
  };

  const count = useMemo(() => {
    let n = 0;
    state.forEach((a) => {
      a.children.forEach((b) => {
        if (!b.disabled) {
          n += 1;
        }
      });
    });

    return n;
  }, []);

  const selectedCount = useMemo(() => {
    let n = 0;
    state.forEach((a) =>
      a.children.forEach((b) => {
        if (b.checked) {
          n += 1;
        }
      })
    );

    return n;
  }, [state]);

  const allSelected = useMemo(() => count === selectedCount, [count, selectedCount]);

  const filteredOptions = useMemo(() => {}, [search, state]);

  return (
    <div style={{ marginLeft: 400, marginTop: 100 }}>
      <Popover
        open
        overlayInnerStyle={{ padding: 0 }}
        content={
          <div style={{ width: 820 }}>
            <Input
              value={search}
              prefix={<Search />}
              placeholder='Search by brand or branch name'
              onChange={(v) => setSearch(v.target.value)}
              className='search-input'
            />
            <Divider style={{ margin: 0, padding: 0 }} />
            <div className='header-container'>
              <Checkbox
                indeterminate={!allSelected && selectedCount !== 0}
                checked={allSelected}
                onChange={(v) => selectAll(v.target.checked)}
              >
                Select All
              </Checkbox>
              <Typography.Text type='secondary'>
                Selected branches ({selectedCount})
              </Typography.Text>
            </div>
            <Divider style={{ margin: 0, padding: 0 }} />
            <Space size={0} style={{ width: '100%' }} className='lists-container'>
              <List
                style={{ overflow: 'auto', height: 400, marginLeft: 20 }}
                dataSource={state}
                renderItem={(item, index) => (
                  <List.Item
                    extra={
                      <Button
                        type='text'
                        onClick={() => setSelected(index)}
                        disabled={item.disabled}
                      >
                        <ArrowRightAlt />
                      </Button>
                    }
                  >
                    <Checkbox
                      checked={item.checked}
                      indeterminate={item.intermediate}
                      onChange={(v) => selectParent(v.target.checked, item.value)}
                      disabled={item.disabled}
                    >
                      <Space size={0} direction='vertical'>
                        <Title value={item.title} />
                        <SubTitle value={item.subTitle} />
                      </Space>
                    </Checkbox>
                    <Button
                      type='text'
                      onClick={() => selectOnlyParent(item.value)}
                      disabled={item.disabled}
                    >
                      Select Only
                    </Button>
                  </List.Item>
                )}
              />
              <Divider type='vertical' style={{ height: 400, margin: 0, padding: 0 }} />
              <List
                style={{ overflow: 'auto', height: 400, marginLeft: 20 }}
                dataSource={selected === -1 ? [] : state[selected].children}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox
                      checked={item.checked}
                      onChange={(v) => selectChild(v.target.checked, item.value)}
                      disabled={item.disabled}
                    >
                      <Space size={0} direction='vertical'>
                        <Title value={item.title} />
                        <SubTitle value={item.subTitle} />
                      </Space>
                    </Checkbox>
                    <Button
                      type='text'
                      onClick={() => selectOnlyChild(item.value)}
                      disabled={item.disabled}
                    >
                      Select Only
                    </Button>
                  </List.Item>
                )}
              />
            </Space>
          </div>
        }
      >
        Vendors
      </Popover>
    </div>
  );
};
