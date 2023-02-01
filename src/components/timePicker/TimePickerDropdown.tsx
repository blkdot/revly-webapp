import { setMinutes } from 'date-fns';
import getHours from 'date-fns/getHours';
import setHours from 'date-fns/setHours';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import FormcontrolKit from '../../kits/formcontrol/FormcontrolKit';
import MenuItemKit from '../../kits/menuItem/MenuItemKit';
import OutlinedInputKit from '../../kits/outlinedInput/OutlinedInputKit';
import SelectKit from '../../kits/select/SelectKit';
import { minHour, rangeHoursOpenedDay } from '../../utlls/heatmap/heatmapSelectedData';

const TimePickerDropdown = (props: any) => {
  const { value, setValue, times, type, index, startLimit } = props;

  const [disabledTimes, setDisabledTimes] = useState([]);

  const getHour = (h) => {
    let hour = getHours(h);

    if (hour < 5) {
      hour = 24 + hour;
    }

    return hour;
  };

  useEffect(() => {
    if (!startLimit) {
      setDisabledTimes([]);
      return;
    }

    const valueLimit = getHour(startLimit);

    if (valueLimit >= getHour(value)) {
      setTimes({ target: { value: rangeHoursOpenedDay[valueLimit].value + 1 } });
    }

    const rangeDisabled = _.range(minHour, valueLimit + 1);

    setDisabledTimes(rangeDisabled);
  }, [startLimit]);

  const setTimes = ({ target }) => {
    const formatedValue = setHours(new Date(setMinutes(new Date(), 0)), target.value);
    if (type) {
      times.splice(index, 1, { ...times[index], [type]: formatedValue });
      setValue([...times]);
    } else {
      setValue(formatedValue);
    }
  };

  const isDisabledItem = (k) => disabledTimes.includes(k);

  return (
    <FormcontrolKit style={{ witdh: '100%' }}>
      <SelectKit
        value={getHours(value) || 0}
        onChange={setTimes}
        input={<OutlinedInputKit />}
        inputProps={{ 'aria-label': 'Without label' }}
        style={{ width: '100%' }}
      >
        {Object.keys(rangeHoursOpenedDay).map((k) => (
          <MenuItemKit
            key={k}
            value={rangeHoursOpenedDay[k].value}
            disabled={isDisabledItem(rangeHoursOpenedDay[k].hour)}
          >
            {rangeHoursOpenedDay[k].label}
          </MenuItemKit>
        ))}
      </SelectKit>
    </FormcontrolKit>
  );
};

export default TimePickerDropdown;
