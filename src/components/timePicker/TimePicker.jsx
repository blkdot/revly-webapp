import * as React from 'react';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TimePickerKit from '../../kits/timePickerKit/TimePickerKit';

const BasicTimePicker = ({ value, setValue, minTime }) => (
  <TimePickerKit
    views={['hours']}
    value={value}
    minTime={minTime}
    onChange={(newValue) => {
      setValue(newValue);
    }}
    renderInput={(params) => <TextfieldKit defaultValue={new Date()} {...params} />}
  />
);
export default BasicTimePicker;
