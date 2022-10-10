import React, { useState, useRef } from 'react';

import { GoChevronDown, GoChevronRight } from 'react-icons/go';

import './FilterDropdown.scss';

import ButtonKit from '../../../kits/button/ButtonKit';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';

import useClickAwayListner from '../../../hooks/useClickAwayListner';

const FilterDropdown = (props) => {
  const { items, values, onChange, label, icon, customTag, maxShowned, internalIconOnActive } =
    props;

  const [isOpen, setIsOpen] = useState(false);

  const refDropdown = useRef(null);

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
      if (items.length === 1) return `${values[0]}${customTag ?? ''}`;

      return `All ${label} selected`;
    }

    if (lengthValues > max) return `${lengthValues} ${label} selected`;

    return `${values.join(`${customTag ?? ''}, `)}${customTag ?? ''}`;
  };

  useClickAwayListner(refDropdown, () => setIsOpen(false));

  const renderItem = () =>
    items.map((item) => (
      <div
        className={`comp-dropdown__item ${values.includes(item.value) ? '__active' : ''}`}
        key={item.value}
        onClick={() => selectItem(item.value)}
        onKeyDown={() => selectItem(item.value)}
        role="button"
        tabIndex={0}>
        <CheckboxKit
          checked={values.includes(item.value)}
          onChange={() => selectItem(item.value)}
        />
        <span>{item.text}</span>
      </div>
    ));

  const renderItems = () => {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="comp-dropdown__content" ref={refDropdown}>
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
        className={`${values.length > 0 ? '__active' : ''}`}>
        {icon}
      </i>
    );
  };

  return (
    <div className="comp-dropdown">
      <ButtonKit
        variant="outlined"
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={() => setIsOpen(!isOpen)}
        role="button"
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className={`${values.length > 0 ? '__active' : ''}`}
        tabIndex={0}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {renderIcon()}
          {getCurrentValue()}
        </div>
        {isOpen ? <GoChevronDown /> : <GoChevronRight />}
      </ButtonKit>
      {renderItems()}
    </div>
  );
};

export default FilterDropdown;
