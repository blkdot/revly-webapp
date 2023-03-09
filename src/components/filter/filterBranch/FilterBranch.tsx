import { useAutoAnimate } from '@formkit/auto-animate/react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ListItemText } from '@mui/material';
import List from '@mui/material/List';
import { useClickAwayListener, useVendors } from 'hooks';
import { ButtonKit, RadioKit } from 'kits';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { TChainData } from 'types';
import './FilterBranch.scss';

const FilterBranch: React.FC<{
  items: TChainData[];
  values: string[];
  icon?: ReactNode;
  onChange: (k: string) => void;
  label: string;
}> = ({ items, values, onChange, label, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('');
  const { vendors } = useVendors();
  const chains = useMemo(
    () => Object.keys(vendors.display).sort((a) => (a.trim() === '' ? 1 : -1)),
    [vendors.display]
  );

  const refDropdown = useRef(null);
  const [regfItemDropdown] = useAutoAnimate();
  const [regfDropdown] = useAutoAnimate();

  const selectItem = (v) => {
    onChange(v);
    setIsOpen(false);
  };

  const filteredData = items.filter((item) => chains.some((name) => item.chain_name === name));

  const getCurrentValue = () => {
    const lengthValues = values.length;
    const max = 1;

    if (lengthValues < 1) {
      return label;
    }

    if (lengthValues === items.length) {
      if (items.length === 1)
        return items.find((item) => values[0] === item.vendor_id)?.vendor_name;

      return `All ${label} selected`;
    }

    if (lengthValues > max) return `${lengthValues} ${label} selected`;

    return items
      .filter((item) => values.includes(String(item.vendor_id)))
      .map((val) => val.vendor_name)
      .join(', ');
  };

  useClickAwayListener(refDropdown, () => setIsOpen(false));

  const renderItem = (branches: TChainData[]) =>
    branches.map((item) => (
      <div
        className={`comp-dropdown__item ${
          values.includes(String(item.vendor_id)) ? '__active' : ''
        }`}
        key={String(item.vendor_id)}
        onClick={() => selectItem(String(item.vendor_id))}
        onKeyDown={() => selectItem(String(item.vendor_id))}
        role='button'
        tabIndex={0}
        style={{ width: '100%' }}
      >
        <RadioKit
          checked={values.includes(String(item.vendor_id))}
          onChange={() => selectItem(String(item.vendor_id))}
        />
        <span>{String(item.vendor_name)}</span>
      </div>
    ));

  const renderNewItem = () =>
    chains.map((name) => {
      const itemData = items.filter((item) => item.chain_name === name);

      if (!name) {
        return (
          <div key={`${name}_key_empty`} role='button' tabIndex={0} style={{ width: '100%' }}>
            {renderItem(itemData)}
          </div>
        );
      }

      if (itemData.length < 1) return null;

      return (
        <div
          key={name}
          onClick={() => setOpenAccordion((prev) => (prev === name ? '' : name))}
          onKeyDown={() => setOpenAccordion((prev) => (prev === name ? '' : name))}
          role='button'
          tabIndex={0}
          style={{ cursor: 'pointer', width: '100%' }}
          ref={regfItemDropdown}
        >
          <ListItemText style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: '0.6rem',
              }}
            >
              {name}
              {openAccordion === name ? <ExpandLess /> : <ExpandMore />}
            </div>
          </ListItemText>
          {openAccordion === name ? (
            <div key={name} style={{ width: '100%' }}>
              {renderItem(itemData)}
            </div>
          ) : null}
        </div>
      );
    });

  const renderItems = () => {
    if (!isOpen || filteredData.length < 1) return null;

    return <div className='comp-dropdown__content'>{renderNewItem()}</div>;
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <i
        style={{ marginRight: '0.5rem', alignItems: 'center' }}
        className={`${values.length > 0 ? '__active' : ''}`}
      >
        {icon}
      </i>
    );
  };

  return (
    <div
      className={`comp-dropdown__branch ${filteredData.length < 1 ? 'disabled' : ''}`}
      ref={refDropdown}
    >
      <ButtonKit
        variant='outlined'
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        role='button'
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className={`${values.length > 0 ? '__active' : ''}`}
        tabIndex={0}
      >
        <div className={`comp-content ${values.length > 0 ? 'active' : ''}`}>
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
      <List component='nav' style={{ display: 'flex', flexDirection: 'column' }} ref={regfDropdown}>
        {renderItems()}
      </List>
    </div>
  );
};

export default FilterBranch;
