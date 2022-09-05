import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React, { useState } from "react";
import PropTypes from "prop-types";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaperKit from "../../kits/paper/PaperKit";
import TypographyKit from "../../kits/typography/TypographyKit";
import DatePickerKit from "../../kits/datePicker/DatePickerKit";
import ButtonKit from "../../kits/button/ButtonKit";
import AccordionSummaryKit from "../../kits/accordionSummary/AccordionSummaryKit";
import AccordionKit from "../../kits/accordion/AccordionKit";
import AccordionDetailsKit from "../../kits/accordionDetails/AccordionDetails";

const DateSelect = ({ type, setSelections }) => {
  const getDate = (type) => {
    const date = new Date()
    if (type === "today") {
      setSelections([{ startDate: date, endDate: date, key: "selection" }])
    }
    else if (type === "yesterday") {
      setSelections([{ startDate: subDays(date, 1), endDate: subDays(date, 1), key: "selection" }])
    }
    else if (type === "week") {
      setSelections([{ startDate: startOfWeek(date), endDate: endOfWeek(date), key: "selection" }])
    }
    else if (type === "last week") {
      setSelections([{ startDate: startOfWeek(subWeeks(date, 1)), endDate: endOfWeek(subWeeks(date, 1)), key: "selection" }])
    }
    else if (type === "month") {
      setSelections([{ startDate: startOfMonth(date), endDate: endOfMonth(date), key: "selection" }])
    }
    else if (type === "last month") {
      setSelections([{ startDate: startOfMonth(subMonths(date, 1)), endDate: endOfMonth(subMonths(date, 1)), key: "selection" }])
    }
  }
  return (
    <AccordionKit className="navbar-accordion">
      <AccordionSummaryKit className="accordion-sum" expandIcon={<ExpandMoreIcon />}>
        <TypographyKit sx={{ display: "flex", alignItems: "center", gridGap: "5px", fontSize: "16px" }}>
          <span>{type}</span>
        </TypographyKit>
      </AccordionSummaryKit>
      <AccordionDetailsKit className="date-accordion-details">
        <span onClick={() => getDate(type === "day" ? "today" : type)}>Current {type}</span>
        <span onClick={() => getDate(type === "day" ? "yesterday" : "last " + type)}>{type === "day" ? "yesterday" : "last " + type}</span>
        <span>Custom {type}</span>
      </AccordionDetailsKit>
    </AccordionKit>
  )
}

const Dates = () => {
  const [leftDate, setLeftDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(false)
  const [rightDate, setRightDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  }])

  const handleOnChange = ranges => {
    const { selection } = ranges;
    setLeftDate([selection]);
    setRightDate([selection])
  }

  return (
    <div className="dates">
      <PaperKit onClick={() => setOpened(true)} className="date-input">
        <TypographyKit className="date-typography">
          <CalendarMonthIcon />
          <span>{new Date(leftDate[0].startDate).toLocaleDateString() + " - " + new Date(leftDate[0].endDate).toLocaleDateString()}</span>
        </TypographyKit>
        <ExpandMoreIcon />
      </PaperKit>
      <PaperKit onClick={() => setSelected(!selected)} className={"date-input " + (selected ? "selected" : "")}>
        <TypographyKit className="date-typography">
          <CalendarMonthIcon />
          <span>{new Date(rightDate[0].startDate).toLocaleDateString() + " - " + new Date(rightDate[0].endDate).toLocaleDateString()}</span>
        </TypographyKit>
        <ExpandMoreIcon />
        <PaperKit className={"date-select " + (selected ? "selected" : "")}>
          <ButtonKit
            onClick={() => setRightDate(
              [{
                startDate: subDays(leftDate[0].startDate, 1),
                endDate: subDays(leftDate[0].endDate, 1)
              }]
            )}>Day - 1</ButtonKit>
          <ButtonKit
            onClick={() => setRightDate(
              [{
                startDate: subWeeks(leftDate[0].startDate, 1),
                endDate: subWeeks(leftDate[0].endDate, 1)
              }]
            )}
          >Same day last week</ButtonKit>
          <ButtonKit
            onClick={() => setRightDate(
              [{
                startDate: subMonths(leftDate[0].startDate, 1),
                endDate: subMonths(leftDate[0].endDate, 1)
              }]
            )}
          >Avg of same day in the past month</ButtonKit>
          <ButtonKit>Custom day</ButtonKit>
        </PaperKit>
      </PaperKit>

      <div className={"date-range-overlay " + (opened ? "opened" : "")} onClick={() => setOpened(false)}>
        <div className="date-range" onClick={(e) => e.stopPropagation()}>
          <PaperKit className="date-picker">
            <DateSelect type={"day"} setSelections={setLeftDate} />
            <DateSelect type={"week"} setSelections={setLeftDate} />
            <DateSelect type={"month"} setSelections={setLeftDate} />
          </PaperKit>
          <DatePickerKit
            onChange={handleOnChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={leftDate}
            direction="horizontal"
          />
        </div>
      </div>
    </div>
  );
};

Dates.propTypes = {
  onChange: PropTypes.func,
};

export default Dates;
