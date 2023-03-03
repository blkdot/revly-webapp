import { useClickAwayListener } from 'hooks';
import { ButtonKit, CheckboxKit, RadioKit } from 'kits';
import { useRef, useState, type ReactNode } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { TPlatformObject } from 'data/platformList';
import './FilterDropdown.scss';

const FilterDropdown: React.FC<{
  items: { value: string; text: string | ReactNode }[];
  values: string[];
  onChange: (k: string) => void;
  label: string;
  icon?: ReactNode;
  customTag?: string;
  internalIconOnActive?: TPlatformObject;
  mono?: boolean;
  maxShowned?: number;
  disabled?: boolean;
  toRight?: boolean;
}> = ({
  items,
  values,
  onChange,
  label,
  icon,
  customTag,
  maxShowned,
  internalIconOnActive,
  mono,
  disabled,
  toRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const refDropdown = useRef(null);

  const [refAnimateShow] = useAutoAnimate();

  const selectItem = (v) => {
    onChange(v);
    setIsOpen(false);
  };

  const getCurrentValue = () => {
    const lengthValues = values.length;
    const max = maxShowned ?? 2;

    if (lengthValues < 1) {
      return label;
    }

    if (lengthValues === items.length) {
      if (items.length === 1) return `${values[0]} ${customTag ?? ''}`;

      return `All ${customTag || label} selected`;
    }

    if (lengthValues > max) return `${lengthValues} ${customTag || label} selected`;

    return `${values.join(`${customTag ?? ''}, `)} ${customTag ?? ''}`;
  };

  useClickAwayListener(refDropdown, () => setIsOpen(false));

  const renderItem = () =>
    items.map((item) => (
      <div
        className={`comp-dropdown__item ${values.includes(item.value) && '__active'}`}
        key={item.value}
        onClick={() => selectItem(item.value)}
        onKeyDown={() => selectItem(item.value)}
        role='button'
        tabIndex={0}
      >
        {mono ? (
          <RadioKit checked={values.includes(item.value)} onChange={() => selectItem(item.value)} />
        ) : (
          <CheckboxKit
            checked={values.includes(item.value)}
            onChange={() => selectItem(item.value)}
          />
        )}
        <span>{item.text}</span>
      </div>
    ));

  const renderItems = () => {
    if (!isOpen || disabled) {
      return null;
    }

    return (
      <div className={`comp-dropdown__content ${toRight ? 'to-right' : ''}`}>
        {renderItem()}
      </div>
    );
  };

  const renderIcon = () => {
    if (internalIconOnActive && values.length > 0)
      return (
        <img
          src={internalIconOnActive[values[0]].src}
          alt={values[0]}
          width={30}
          style={{ verticalAlign: 'middle' }}
        />
      );

    return (
      <i
        style={{ marginRight: '0.5rem', alignItems: 'center' }}
        className={`${values.length > 0 && '__active'}`}
      >
        {icon}
      </i>
    );
  };

  return (
    <div className={`comp-dropdown ${disabled ? 'disabled' : ''}`} ref={refDropdown}>
      <ButtonKit
        variant='outlined'
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        role='button'
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className={`${values.length > 0 && '__active'}`}
        tabIndex={0}
      >
        <div className={`comp-content ${values.length > 0 && 'active'}`}>
          {renderIcon()}
          {getCurrentValue()}
        </div>
        <div
          className='comp-dropdown-arrow'
          style={{ display: 'flex', marginLeft: '1rem', alignItems: 'center' }}
        >
          {isOpen ? <FaChevronRight /> : <FaChevronDown />}
        </div>
      </ButtonKit>
      <div ref={refAnimateShow}>{renderItems()}</div>
    </div>
  );
};

export default FilterDropdown;
