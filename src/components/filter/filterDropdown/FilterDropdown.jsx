import React, { useState, useRef } from 'react';

import './FilterDropdown.scss';

import ButtonKit from '../../../kits/button/ButtonKit';

import FilterIcon from '../../../assets/images/ic_filter.png';
import useClickAwayListner from '../../../hooks/useClickAwayListner';

const FilterDropdown = (props) => {
  const { items, values, onChange, label } = props;

  const [isOpen, setIsOpen] = useState(false);

  const refDropdown = useRef(null);

  const selectItem = (v) => {
    onChange(v);
    setIsOpen(false);
  };

  const getCurrentValue = () => {
    const current = items.find((i) => i.value === values[0]);

    if (!current) {
      return label;
    }

    return current.text;
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

  return (
    <div className="comp-dropdown">
      <ButtonKit
        variant="outlined"
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}>
        <img src={FilterIcon} alt="Filter Icon" />
        {getCurrentValue()}
      </ButtonKit>
      {renderItems()}
    </div>
  );
};

export default FilterDropdown;
