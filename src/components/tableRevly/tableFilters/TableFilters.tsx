import { Switch } from 'assets/icons';
import FilterDropdown from 'components/filter/filterDropdown/FilterDropdown';
import { platformObject } from 'data/platformList';
import { FC } from 'react';
import Columns from '../../../assets/images/columns.svg';

const TableFilters: FC<{
  handleChangeMultipleFilter: (k: string) => (v: string) => void;
  filters: {
    discount_rate?: any[];
    end_hour?: any[];
    platform?: any[];
    start_hour?: any[];
    status?: any[];
    type_offer?: any[];
  };
  filtersHead: {
    discount_rate?: any[];
    end_hour?: any[];
    platform?: any[];
    start_hour?: any[];
    status?: any[];
    type_offer?: any[];
  };
}> = ({ handleChangeMultipleFilter, filters, filtersHead }) => (
  <div className='table-filters'>
    <FilterDropdown
      items={filtersHead.platform}
      values={filters.platform}
      onChange={handleChangeMultipleFilter('platform')}
      label='Platforms'
      icon={<img src={Columns} alt='Clock' />}
      internalIconOnActive={platformObject}
      maxShowned={1}
    />
    <FilterDropdown
      items={filtersHead.status}
      values={filters.status}
      onChange={handleChangeMultipleFilter('status')}
      label='Statuses'
      icon={<Switch />}
      maxShowned={1}
    />
  </div>
);

export default TableFilters;
