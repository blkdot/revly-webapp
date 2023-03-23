import Dates from 'components/dates/Dates';
import HeaderDropdowns from 'components/header/HeaderDropdowns';
import { VendorsDropdownAdapter } from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { endOfMonth, endOfWeek } from 'date-fns';
import { useDate, useVendors } from 'hooks';
import { FC, useState } from 'react';

const SettingsTopInputs: FC = () => {
  const { vendors } = useVendors();
  const { date } = useDate();
  const getOfferDate = () => {
    if (date.typeDate === 'month') {
      return endOfMonth(new Date(date.beforePeriod.endDate));
    }
    if (date.typeDate === 'week') {
      return endOfWeek(new Date(date.beforePeriod.endDate), { weekStartsOn: 1 });
    }
    return date.beforePeriod.endDate;
  };
  const [dateRange, setDateRange] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: getOfferDate(),
  });
  return (
    <div className='top-inputs'>
      <VendorsDropdownAdapter />
      <div style={{ display: 'flex', gap: '10px' }}>
        <Dates offer beforePeriodBtn={dateRange} setbeforePeriodBtn={setDateRange} />
        <HeaderDropdowns />
      </div>
    </div>
  );
};

export default SettingsTopInputs;
