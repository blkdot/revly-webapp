import React from 'react';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import enGB from 'date-fns/esm/locale/en-GB';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addYears } from 'date-fns';

const DatePickerDayKit = (props) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
    <DatePicker maxDate={new Date(addYears(new Date(), 1))} {...props} />
  </LocalizationProvider>
);

export default DatePickerDayKit;
