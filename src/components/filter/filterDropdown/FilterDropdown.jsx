import React, { useState, useRef } from 'react';
import { Chip } from '@mui/material';

import './FilterDropdown.scss';

import ButtonKit from '../../../kits/button/ButtonKit';
import CheckboxKit from '../../../kits/checkbox/CheckboxKit';

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
    const lengthValues = values.length;

    if (lengthValues < 1) {
      return label;
    }

    if (lengthValues === items.length)
      return <Chip size="small" style={{ margin: '0 2px' }} label={`All ${label} selected`} />;

    if (lengthValues > 2)
      return (
        <Chip
          size="small"
          style={{ margin: '0 2px' }}
          label={`${lengthValues} ${label} selected`}
        />
      );

    return values.map((v) => {
      const item = items.find((i) => v === i.value);

      return <Chip key={item.value} size="small" style={{ margin: '0 2px' }} label={item.text} />;
    });
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
