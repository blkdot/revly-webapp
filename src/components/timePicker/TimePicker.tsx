import { TextfieldKit, TimePickerKit } from 'kits';

const BasicTimePicker = ({ value, setValue, type, times, index, defaultValue }) => {
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
      defaultValue={defaultValue}
      value={value}
      onChange={(newValue) => setTimes(newValue)}
      renderInput={(params) => <TextfieldKit {...params} />}
    />
  );
};
export default BasicTimePicker;
