import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React, { useState } from "react";
import PropTypes from "prop-types";
import { endOfMonth, endOfWeek, getWeek, getMonth, lastDayOfMonth } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaperKit from "../../kits/paper/PaperKit";
import TypographyKit from "../../kits/typography/TypographyKit";
import DatePickerKit from "../../kits/datePicker/DatePickerKit";
import ButtonKit from "../../kits/button/ButtonKit";
import useDate from "../../hooks/useDate";
import { DateSelect } from "./DateSelect";
import RightDateSelect from "./RightDateSelect";

const Dates = () => {
  const { setLeft, setRight } = useDate();

  const [opened, setOpened] = useState(false);
  const [openedRight, setOpenedRight] = useState(false);
  const [selected, setSelected] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [leftDateBtn, setLeftDateBtn] = useState({ startDate: new Date(), endDate: new Date() })
  const [rightDateBtn, setRightDateBtn] = useState({ startDate: new Date(), endDate: new Date() })
  const [leftDate, setLeftDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);
  const [rightDate, setRightDate] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  }]);
  const handleClick = () => {
    const startDate = new Date(leftDate[0].startDate);
    const endDate = new Date(leftDate[0].endDate);
    setLeftDateBtn({ startDate: startDate, endDate: endDate })
    setOpened(false)
    setLeft({ startDate: startDate, endDate: endDate })
  };
  const handleClickRight = () => {
    const startDate = new Date(rightDate[0].startDate);
    const endDate = new Date(rightDate[0].endDate);
    setRightDateBtn({ startDate: startDate, endDate: endDate })
    setOpenedRight(false)
    setRight({ startDate: startDate, endDate: endDate })
  }

  const handleOnChangeRight = ranges => {
    const { selection } = ranges;
    setRightDate([selection]);
  }

  const handleOnChange = ranges => {
    const { selection } = ranges;
    setLeftDate([selection]);
  }

  const getRightDate = () => {
    const date = new Date()
    const startDate = new Date(leftDateBtn.startDate);
    const endDate = new Date(leftDateBtn.endDate);
    const startDateRight = new Date(rightDate[0].startDate)
    const endDateRight = new Date(rightDate[0].endDate)
    const startLocalRight = startDateRight.toLocaleDateString();
    const endLocalRight = endDateRight.toLocaleDateString();
    const startGetDateRight = startDateRight.getDate();
    const endGetDateRight = endDateRight.getDate();
    const startGetDayRight = startDateRight.getDay();
    const endGetDayRight = endDateRight.getDay();
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();

    if (getMonth(startDateRight) === getMonth(date)) {
      if (startLocal === endLocal) {
        if (startLocalRight === endLocalRight) return true
        return false
      }
      else if (
        getWeek(startDate, 1) === getWeek(endDate, 1) &&
        startGetDay === 0 && endGetDay >= dateGetDay && startGetDay <= 6
      ) {
        if (
          startGetDayRight === 0 && endGetDayRight >= dateGetDay &&
          startGetDayRight <= endOfWeek(startDateRight)
        ) return true
        return false
      }
      else if (
        getMonth(startDate, 1) === getMonth(endDate, 1) &&
        startGetDate === 1 && endGetDate >= dateGetDate &&
        startGetDate <= lastDayOfMonth(endDate).getDate()
      ) {
        if (
          startGetDateRight === 1 && endGetDateRight >= dateGetDate &&
          startGetDateRight <= lastDayOfMonth(endDateRight).getDate()
        ) return true
        return false
      }
      else {
        if (
          (startGetDate - endGetDate) === (startGetDateRight - endGetDateRight)
        ) return true
        return false
      }
    }
    else {
      if (
        getWeek(startDate, 1) === getWeek(endDate, 1) &&
        startGetDay === 0 && endGetDay >= dateGetDay && startGetDay <= 6
      ) {
        if (
          startGetDayRight === 0 &&
          endGetDayRight === endOfWeek(endDateRight).getDay()
        ) return true
        return false
      }
      else if (
        getMonth(startDate, 1) === getMonth(endDate, 1) &&
        startGetDate === 1 && endGetDate >= dateGetDate &&
        startGetDate <= lastDayOfMonth(endDate).getDate()
      ) {
        if (
          startGetDateRight === 1 &&
          endGetDateRight === endOfMonth(endDateRight).getDate()
        ) return true
        return false
      }
      else {
        if (
          (startGetDate - endGetDate) === (startGetDateRight - endGetDateRight)
        ) return true
        return false
      }
    }
  }

  return (
    <div className="dates">
      <div className="date-picker_wrapper">
        <PaperKit component="div" onClick={() => setOpened(true)} className="date-input">
          <TypographyKit className="date-typography">
            <CalendarMonthIcon />
            <span>{new Date(leftDateBtn.startDate).toLocaleDateString() + " - " + new Date(leftDateBtn.endDate).toLocaleDateString()}</span>
          </TypographyKit>
          <ExpandMoreIcon />
        </PaperKit>
        <div className={"date-range " + (opened ? "opened" : "")} onClick={(e) => e.stopPropagation()}>
          <PaperKit className="date-picker">
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"1"}
              type={"day"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"2"}
              type={"week"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"3"}
              type={"month"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <div className="date-btn-wrapper">
              <ButtonKit
                onClick={handleClick}
                className={"date-save-btn "} variant={"contained"}>
                Ok
              </ButtonKit>
            </div>
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
      <div className="date-picker_wrapper">
        <TypographyKit component="div" className="date-input-wrapper">
          <PaperKit onClick={() => setSelected(!selected)} className={"date-input " + (selected ? "selected" : "")}>
            <TypographyKit component="div" className="date-typography">
              <CalendarMonthIcon />
              <span>{new Date(rightDateBtn.startDate).toLocaleDateString() + " - " + new Date(rightDateBtn.endDate).toLocaleDateString()}</span>
            </TypographyKit>
            <ExpandMoreIcon />
          </PaperKit>
          <RightDateSelect setOpenedRight={setOpenedRight} setRightDate={setRightDate} selected={selected} leftDate={leftDateBtn} />
        </TypographyKit>
        <div className={"date-range " + (openedRight ? "opened" : "")} onClick={(e) => e.stopPropagation()}>
          <PaperKit className="date-picker">
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"1"}
              type={"day"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"2"}
              type={"week"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <DateSelect
              expanded={expanded}
              setExpanded={setExpanded}
              index={"3"}
              type={"month"}
              setSelections={setLeftDate}
              setRightDate={setRightDate}
            />
            <div className="date-btn-wrapper">
              <ButtonKit
                disabled={getRightDate() ? false : true}
                onClick={handleClickRight}
                className={"date-save-btn " + (getRightDate() ? "" : "date-disabled-btn")} variant={"contained"}>
                Ok
              </ButtonKit>
            </div>
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
      <div className={"date-range-overlay " + (opened ? "opened" : "")} onClick={() => setOpened(false)}></div>
      <div className={"date-range-overlay " + (openedRight ? "opened" : "")} onClick={() => setOpenedRight(false)}></div>
    </div>

  );
};

Dates.propTypes = {
  onChange: PropTypes.func,
};

export default Dates;
