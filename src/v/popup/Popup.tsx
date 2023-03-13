import { Search } from '@mui/icons-material';
import { Checkbox, Divider, Input, Typography } from 'antd';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { ChildrenList } from './list/children/ChildrenList';
import { ParentList } from './list/parent/ParentList';
import './Popup.scss';

type Value = number | string;

type Option = {
  value: Value;
  title: ReactNode;
  subTitle: ReactNode;
  label: string;
  disabled?: boolean;
  children: {
    value: Value;
    title: ReactNode;
    subTitle: ReactNode;
    label: string;
    disabled?: boolean;
  }[];
};

const unique = (values: Value[]): Value[] => Array.from(new Set(values));

const findAllValues = (options: Option[]): Value[] => {
  const values: Value[] = [];
  options.forEach((a) => {
    if (!a.disabled) {
      a.children.forEach((b) => {
        if (!b.disabled) {
          values.push(b.value);
        }
      });
    }
  });

  return unique(values);
};

export const Popup: FC<{
  values: Value[];
  options: Option[];
  onChange: (v: Value[]) => void;
}> = ({ values, options, onChange }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Value>(null);

  const valuesSet = useMemo(() => new Set(values), [values]);

  const onParentSelect = useCallback(
    (v: boolean, value: Value) => {
      const children: Value[] = [];
      options.forEach((a) => {
        if (a.value === value) {
          a.children.forEach((b) => {
            if (!b.disabled) {
              children.push(b.value);
            }
          });
        }
      });

      if (v) {
        onChange(unique([...values, ...children]));
      } else {
        onChange(unique(values.filter((a) => !children.find((b) => a === b))));
      }
    },
    [values, options, onChange]
  );

  const onSelectOnlyParent = useCallback(
    (value: Value) => {
      const out: Value[] = [];
      options.forEach((a) => {
        if (a.value === value) {
          setSelected(value);
          a.children.forEach((b) => {
            if (!b.disabled) {
              out.push(b.value);
            }
          });
        }
      });

      onChange(unique(out));
    },
    [options, setSelected, onChange]
  );

  const onSelectChild = useCallback(
    (v: boolean, value: Value) => {
      if (v) {
        onChange(unique([...values, value]));
      } else {
        onChange(unique(values.filter((a) => a !== value)));
      }
    },
    [values, onChange]
  );

  const onSelectOnlyChild = (value: Value) => onChange([value]);

  const selectAll = (v: boolean) => {
    if (v) {
      onChange(findAllValues(options));
    } else {
      onChange([]);
    }
  };

  const totalCount = useMemo(() => {
    let n = 0;
    options.forEach((a) => {
      if (!a.disabled) {
        a.children.forEach((b) => {
          if (!b.disabled) {
            n += 1;
          }
        });
      }
    });

    return n;
  }, [options]);

  const selectedCount = useMemo(() => {
    let n = 0;
    options.forEach((a) =>
      a.children.forEach((b) => {
        if (valuesSet.has(b.value)) {
          n += 1;
        }
      })
    );

    return n;
  }, [valuesSet, options]);

  const allSelected = useMemo(() => totalCount === selectedCount, [totalCount, selectedCount]);

  const filteredOptions = useMemo(() => {
    const out = [];
    options.forEach((a) => {
      if (a.label.includes(search)) {
        out.push(a);
        return;
      }

      const children = a.children.filter((b) => b.label.includes(search));
      if (children.length > 0) {
        out.push({ ...a, children });
      }
    });

    return out;
  }, [search, options]);

  const parentListItems = useMemo(() => {
    const items = [];
    filteredOptions.forEach((v) => {
      const checked = v.children.filter((c) => !c.disabled).every((c) => valuesSet.has(c.value));
      const intermediate =
        !checked && v.children.filter((c) => !c.disabled).some((c) => valuesSet.has(c.value));

      items.push({
        value: v.value,
        title: v.title,
        subTitle: v.subTitle,
        disabled: v.disabled,
        checked,
        intermediate,
      });
    });

    return items;
  }, [valuesSet, filteredOptions]);

  const childrenListItems = useMemo(() => {
    if (selected === null) {
      return [];
    }

    const items = [];
    filteredOptions
      .find((v) => v.value === selected)
      ?.children.forEach((v) => {
        items.push({
          value: v.value,
          title: v.title,
          subTitle: v.subTitle,
          disabled: v.disabled,
          checked: valuesSet.has(v.value),
        });
      });

    return items;
  }, [selected, valuesSet, filteredOptions]);

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
          items={parentListItems}
          onSelect={onParentSelect}
          onSelectOnly={onSelectOnlyParent}
          setSelected={setSelected}
        />
        <Divider type='vertical' />
        <ChildrenList
          items={childrenListItems}
          onSelect={onSelectChild}
          onSelectOnly={onSelectOnlyChild}
        />
      </div>
    </>
  );
};
