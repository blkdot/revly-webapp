import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React, { useState } from "react";
import PropTypes from "prop-types";
import { endOfMonth, endOfWeek, getWeek, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, getMonth, lastDayOfMonth } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaperKit from "../../kits/paper/PaperKit";
import TypographyKit from "../../kits/typography/TypographyKit";
import DatePickerKit from "../../kits/datePicker/DatePickerKit";
import ButtonKit from "../../kits/button/ButtonKit";
import AccordionSummaryKit from "../../kits/accordionSummary/AccordionSummaryKit";
import AccordionKit from "../../kits/accordion/AccordionKit";
import AccordionDetailsKit from "../../kits/accordionDetails/AccordionDetails";



const DateSelect = ({ type, setSelections, setRightDate }) => {
  const getDate = (type) => {
    const date = new Date()
    if (type === "today") {
      setSelections([{ startDate: date, endDate: date, key: "selection" }])
      setRightDate([{ startDate: date, endDate: date, key: "selection" }])
    }
    else if (type === "yesterday") {
      setSelections([{ startDate: subDays(date, 1), endDate: subDays(date, 1), key: "selection" }])
      setRightDate([{ startDate: subDays(date, 1), endDate: subDays(date, 1), key: "selection" }])

    }
    else if (type === "week") {
      setSelections([{ startDate: startOfWeek(date), endDate: date, key: "selection" }])
      setRightDate([{ startDate: startOfWeek(date), endDate: date, key: "selection" }])
    }
    else if (type === "last week") {
      setSelections([{ startDate: startOfWeek(subWeeks(date, 1)), endDate: endOfWeek(subWeeks(date, 1)), key: "selection" }])
      setRightDate([{ startDate: startOfWeek(subWeeks(date, 1)), endDate: endOfWeek(subWeeks(date, 1)), key: "selection" }])

    }
    else if (type === "month") {
      setSelections([{ startDate: startOfMonth(date), endDate: date, key: "selection" }])
      setRightDate([{ startDate: startOfMonth(date), endDate: date, key: "selection" }])

    }
    else if (type === "last month") {
      setSelections([{ startDate: startOfMonth(subMonths(date, 1)), endDate: endOfMonth(subMonths(date, 1)), key: "selection" }])
      setRightDate([{ startDate: startOfMonth(subMonths(date, 1)), endDate: endOfMonth(subMonths(date, 1)), key: "selection" }])

    }
  }
  return (
    <AccordionKit className="navbar-accordion">
      <ButtonKit className="navbar-button-kit">
        <AccordionSummaryKit className="accordion-sum" expandIcon={<ExpandMoreIcon />}>
          <TypographyKit sx={{ display: "flex", alignItems: "center", gridGap: "5px", fontSize: "16px" }}>
            <span>{type}</span>
          </TypographyKit>
        </AccordionSummaryKit>
      </ButtonKit>
      <AccordionDetailsKit className="date-accordion-details">
        <ButtonKit className="navbar-button-kit" onClick={() => getDate(type === "day" ? "today" : type)}>Current {type}</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={() => getDate(type === "day" ? "yesterday" : "last " + type)}>{type === "day" ? "yesterday" : "last " + type}</ButtonKit>
      </AccordionDetailsKit>
    </AccordionKit>
  )
}

const RightDateSelect = ({ setRightDate, leftDate, selected, setOpenedRight }) => {
  const startDate = new Date(leftDate[0].startDate);
  const endDate = new Date(leftDate[0].endDate);
  const date = new Date();

  const openRight = () => {
    setRightDate([{ startDate: new Date(), endDate: new Date(), key: "selection" }])
    setOpenedRight(true)
  }
  return (
    <PaperKit className={"date-select " + (selected ? "selected" : "")}>
      {
        startDate.toLocaleDateString() === endDate.toLocaleDateString() ?
          <div>
            <ButtonKit
              onClick={() => setRightDate(
                [{
                  startDate: subDays(startDate, 1),
                  endDate: subDays(endDate, 1),
                  key: "selection"
                }]
              )}>Day - 1</ButtonKit>
            <ButtonKit
              onClick={() => setRightDate(
                [{
                  startDate: subWeeks(startDate, 1),
                  endDate: subWeeks(endDate, 1),
                  key: "selection"
                }]
              )}
            >Same day last week</ButtonKit>
            <ButtonKit onClick={openRight}>Custom Date</ButtonKit>
          </div> : getWeek(startDate, 1) === getWeek(endDate, 1) && startDate.getDay() === 0 && endDate.getDay() >= date.getDay() && endDate.getDay() <= 6 ? <div>
            <ButtonKit
              onClick={() => setRightDate(
                [{
                  startDate: subWeeks(startDate, 1),
                  endDate: subWeeks(endDate, 1),
                  key: "selection"
                }]
              )}>Week - 1</ButtonKit>
            <ButtonKit
              onClick={() => setRightDate(
                [{
                  startDate: subMonths(startDate, 1),
                  endDate: subMonths(endDate, 1),
                  key: "selection"
                }]
              )}
            >Weekly Avg of the previous month</ButtonKit>
            <ButtonKit onClick={openRight}>Custom Date</ButtonKit>
          </div > : startDate.getDate() === 1 && endDate.getDate() >= date.getDate() && endDate.getDate() <= lastDayOfMonth(endDate, 1) ? <div>
            <ButtonKit
              onClick={() => setRightDate(
                [{
                  startDate: subMonths(startDate, 1),
                  endDate: subMonths(endDate, 1),
                  key: "selection"
                }]
              )}>Month - 1</ButtonKit>

            <ButtonKit onClick={openRight}>Custom Date</ButtonKit>
            </div> : <div>
              <ButtonKit
                onClick={() => setRightDate(
                  [{
                    startDate: subDays(startDate, startDate.getDate() + endDate.getDate() - 1),
                    endDate: subDays(endDate, startDate.getDate() + endDate.getDate() - 1),
                    key: "selection"
                  }]
                )}>Date - 1</ButtonKit>
              <ButtonKit onClick={openRight}>Custom Date</ButtonKit>
            </div>
      }
    </PaperKit >
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
  const [openedRight, setOpenedRight] = useState(false);
  const [selected, setSelected] = useState(false)
  const [rightDate, setRightDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  }])

  const handleOnChangeRight = ranges => {
    const { selection } = ranges;
    setRightDate([selection]);
  }

  const handleOnChange = ranges => {
    const { selection } = ranges;
    setLeftDate([selection]);
  }
  return (
    <div className="dates">
      <PaperKit component="div" onClick={() => setOpened(true)} className="date-input">
        <TypographyKit className="date-typography">
          <CalendarMonthIcon />
          <span>{new Date(leftDate[0].startDate).toLocaleDateString() + " - " + new Date(leftDate[0].endDate).toLocaleDateString()}</span>
        </TypographyKit>
        <ExpandMoreIcon />
      </PaperKit>
      <TypographyKit component="div" className="date-input-wrapper">
        <PaperKit onClick={() => setSelected(!selected)} className={"date-input " + (selected ? "selected" : "")}>
          <TypographyKit component="div" className="date-typography">
            <CalendarMonthIcon />
            <span>{new Date(rightDate[0].startDate).toLocaleDateString() + " - " + new Date(rightDate[0].endDate).toLocaleDateString()}</span>
          </TypographyKit>
          <ExpandMoreIcon />
        </PaperKit>
        <RightDateSelect setOpenedRight={setOpenedRight} setRightDate={setRightDate} selected={selected} leftDate={leftDate} />
      </TypographyKit>

      <div className={"date-range-overlay " + (opened ? "opened" : "")} onClick={() => setOpened(false)}>
        <div className="date-range" onClick={(e) => e.stopPropagation()}>
          <PaperKit className="date-picker">
            <DateSelect type={"day"} setSelections={setLeftDate} setRightDate={setRightDate} />
            <DateSelect type={"week"} setSelections={setLeftDate} setRightDate={setRightDate} />
            <DateSelect type={"month"} setSelections={setLeftDate} setRightDate={setRightDate} />
          </PaperKit>
          <DatePickerKit
            maxDate={new Date()}
            onChange={handleOnChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={leftDate}
            direction="horizontal"
          />
        </div>
      </div>
      <div className={"date-range-overlay " + (openedRight ? "opened" : "")} onClick={() => setOpenedRight(false)}>
        <div className="date-range" onClick={(e) => e.stopPropagation()}>
          <PaperKit className="date-picker">
            <DateSelect type={"day"} setSelections={setLeftDate} setRightDate={setRightDate} />
            <DateSelect type={"week"} setSelections={setLeftDate} setRightDate={setRightDate} />
            <DateSelect type={"month"} setSelections={setLeftDate} setRightDate={setRightDate} />
          </PaperKit>
          <DatePickerKit
            maxDate={new Date()}
            onChange={handleOnChangeRight}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={rightDate}
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
