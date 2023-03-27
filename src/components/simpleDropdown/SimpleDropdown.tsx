import { Popover } from 'antd';
import { FC, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from './icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from './icons/arrow-up.svg';
import './SimpleDropdown.scss';

const SimpleDropdown: FC<{
  selected: any;
  renderOption: any;
  items: any;
  renderValue?: any;
  disabled?: boolean;
  rootClassName?: string;
  className?: string;
}> = ({ selected, renderOption, items, renderValue, disabled, rootClassName, className }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    if (!items.length || disabled) return;
    setOpen(value);
    const body = document.querySelector('body');
    if (value) {
      body.style.overflowY = 'hidden';
      return;
    }
    body.style.overflowY = 'visible';
  };
  const renderSelectItem = (arr) => arr?.map((v, index) => renderOption(v, index));
  const renderValues = () => {
    if (renderValue) {
      return renderValue();
    }
    if (!selected.length) {
      return 'No Item Selected';
    }
    return selected.join(', ');
  };
  return (
    <Popover
      placement='bottomRight'
      open={open}
      trigger='click'
      onOpenChange={handleOpen}
      rootClassName={`simple-dropdown__content ${rootClassName}`}
      content={renderSelectItem(items)}
    >
      <div className={`dropdown-header ${(!items.length || disabled) && 'disabled'} ${className}`}>
        <div className='content'>
          <div className='text'>{renderValues()}</div>
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

export default SimpleDropdown;
