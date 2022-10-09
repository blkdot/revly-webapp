import React from 'react';
import { Dialog } from '@mui/material';

import './FilterMore.scss';

import filterOffersData from '../../../data/filterOffersData';
import FilterDropdown from '../filterDropdown/FilterDropdown';
import RangeSelector from '../../rangeSelector/RangeSelector';

const FilterMore = (props) => {
  const { open, onClose, onChangeMultipleSelect, filters, onChangeProcent } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <div className="filter-more">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginTop: '0.5rem', width: '100%' }}>
            <FilterDropdown
              items={filterOffersData.status}
              values={filters.status}
              onChange={onChangeMultipleSelect('status')}
              label="Status"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <FilterDropdown
              items={filterOffersData.days}
              values={filters.days}
              onChange={onChangeMultipleSelect('days')}
              label="Days"
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <RangeSelector
              min={-200}
              max={200}
              step={2}
              values={filters.procent}
              onChange={onChangeProcent}
              valueLabelDisplay="auto"
              label="test"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterMore;
