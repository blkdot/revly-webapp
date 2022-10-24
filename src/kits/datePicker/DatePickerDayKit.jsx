import React from 'react';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import enGB from 'date-fns/esm/locale/en-GB';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DatePickerDayKit = (props) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
    <DatePicker {...props} />
  </LocalizationProvider>
);

export default DatePickerDayKit;
