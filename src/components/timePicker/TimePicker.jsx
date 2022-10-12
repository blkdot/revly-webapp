import * as React from 'react';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import TimePickerKit from '../../kits/timePickerKit/TimePickerKit';

const BasicTimePicker = ({ value, setValue, minTime, type, times, index }) => {
  const setTimes = (newValue) => {
    if (type) {
      times.splice(index, 1, { ...times[index], [type]: newValue });
      setValue([...times]);
    } else {
      setValue(newValue);
    }
  };
  return (
    <TimePickerKit
      views={['hours']}
      value={value}
      minTime={minTime}
      onChange={(newValue) => setTimes(newValue)}
      renderInput={(params) => <TextfieldKit {...params} />}
    />
  );
};
export default BasicTimePicker;
