import { Search } from '@mui/icons-material';
import { Checkbox, Divider, Input, Typography } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ChildrenList } from './list/children/ChildrenList';
import { ParentList } from './list/parent/ParentList';
import './Popup.scss';

const copy = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;

type Value = number | string;

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

const findChecked = (state: State): Value[] => {
  const values: Value[] = [];

  state.forEach((a) => {
    a.children.forEach((b) => {
      if (b.checked) {
        values.push(b.value);
      }
    });
  });

  return values;
};

const toState = (values: Value[], options: Option[]): State => {
  const state: State = [];

  options.forEach((a) => {
    const children = [];

    a.children.forEach((b) => {
      children.push({
        value: b.value,
        title: b.title,
        subTitle: b.subTitle,
        checked: values.includes(b.value),
        disabled: b.disabled,
      });
    });

    state.push({
      value: a.value,
      title: a.title,
      subTitle: a.subTitle,
      checked: children.every((c) => c.checked),
      intermediate: children.some((c) => c.checked),
      disabled: a.disabled,
      children,
    });
  });

  return state;
};

export const Popup: FC<{
  values: Value[];
  options: Option[];
  onChange: (v: Value[]) => void;
}> = ({ values, options, onChange }) => {
  const [selected, setSelected] = useState(-1);
  const [state, setState] = useState(toState(values, options));
  const [search, setSearch] = useState('');

  useEffect(() => {
    setState(toState(values, options));
  }, [values, options]);

  const onParentSelect = useCallback(
    (v: boolean, value: Value) => {
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

        onChange(findChecked(newState));

        return newState;
      });
    },
    [setState, setSelected, onChange]
  );

  const onSelectOnlyParent = useCallback(
    (value: Value) => {
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

        onChange(findChecked(newState));

        return newState;
      });
    },
    [setState, setSelected, onChange]
  );

  const onSelectChild = useCallback(
    (v: boolean, value: Value) => {
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

        onChange(findChecked(newState));

        return newState;
      });
    },
    [setState, selected, onChange]
  );

  const onSelectOnlyChild = useCallback(
    (value: Value) => {
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

        onChange(findChecked(newState));

        return newState;
      });
    },
    [setState, selected, onChange]
  );

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

      onChange(findChecked(newState));

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
    <>
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
        <Typography.Text type='secondary'>Selected branches ({selectedCount})</Typography.Text>
      </div>
      <Divider style={{ margin: 0, padding: 0 }} />
      <div className='lists-container'>
        <ParentList
          items={state}
          onSelect={onParentSelect}
          onSelectOnly={onSelectOnlyParent}
          setSelected={setSelected}
        />
        <Divider type='vertical' />
        <ChildrenList
          items={selected === -1 ? [] : state[selected].children}
          onSelect={onSelectChild}
          onSelectOnly={onSelectOnlyChild}
        />
      </div>
    </>
  );
};
