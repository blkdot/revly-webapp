import { Popover } from 'antd';
import { FC, ReactNode, useMemo, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from './icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from './icons/arrow-up.svg';
import { ReactComponent as VendorIcon } from './icons/vendor.svg';
import { Popup } from './popup/Popup';
import './VendorsDropdown.scss';

type Value = number | string;

type Option = {
  value: Value;
  title: ReactNode;
  subTitle?: ReactNode;
  label: string;
  disabled?: boolean;
  children: {
    value: Value;
    title: ReactNode;
    subTitle?: ReactNode;
    label: string;
    disabled?: boolean;
  }[];
};

const getSelectedParents = (values: Value[], options: Option[]): string[] => {
  const out = [];

  options.forEach((a) => {
    if (a.children.some((b) => values.some((v) => v === b.value))) {
      out.push(a.title);
    }
  });

  return out;
};

export const VendorsDropdown: FC<{
  values: Value[];
  options: Option[];
  onChange: (v: Value[]) => void;
}> = ({ values, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(value);
    const body = document.querySelector('body');
    if (value) {
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const selected = useMemo(() => getSelectedParents(values, options), [values, options]);

  return (
    <Popover
      placement='bottomLeft'
      open={open}
      trigger='click'
      onOpenChange={handleOpen}
      rootClassName='dropdown-popup'
      content={<Popup values={values} options={options} onChange={onChange} />}
    >
      <div className={`dropdown-header ${!selected.length && 'disabled'}`}>
        <div className='content'>
          <VendorIcon />
          <div className='text'>
            {selected.length ? selected.join(', ') : 'No Vendors Selected'}
          </div>
          {open ? (
            <ArrowUpIcon
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(!open);
              }}
              tabIndex={-1}
              role='presentation'
            />
          ) : (
            <ArrowDownIcon
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(!open);
              }}
              tabIndex={-1}
              role='presentation'
            />
          )}
        </div>
      </div>
    </Popover>
  );
};
