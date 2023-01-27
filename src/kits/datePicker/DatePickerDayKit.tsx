import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addYears } from 'date-fns';
import enGB from 'date-fns/esm/locale/en-GB';

const DatePickerDayKit = (props: any) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
    <DatePicker maxDate={new Date(addYears(new Date(), 1))} {...props} />
  </LocalizationProvider>
);

export default DatePickerDayKit;
