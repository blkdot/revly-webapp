import React, { useState } from "react";
import dayjs from "dayjs";

import "./Dates.scss";

import DatePickerKit from "../../kits/datePicker/DatePickerKit";
import TextfieldKit from "../../kits/textfield/TextfieldKit";

const Dates = () => {
  const [fromDate, setFromDate] = useState(dayjs(new Date()));
  const [toDate, setToDate] = useState(dayjs(new Date()));

  return (
    <div className="dates">
      <DatePickerKit
        label="From"
        inputFormat="dd/MM/yyyy"
        value={fromDate}
        onChange={setFromDate}
        renderInput={(params) => <TextfieldKit {...params} />}
      />
      <DatePickerKit
        label="To"
        inputFormat="dd/MM/yyyy"
        value={toDate}
        onChange={setToDate}
        renderInput={(params) => <TextfieldKit {...params} />}
      />
    </div>
  );
}

export default Dates;
