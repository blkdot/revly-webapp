import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React, { useState } from "react";
import PropTypes from "prop-types";
import { endOfMonth, endOfWeek, getWeek, getMonth, lastDayOfMonth, startOfWeek, startOfMonth, subDays, subWeeks, subMonths } from "date-fns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaperKit from "../../kits/paper/PaperKit";
import TypographyKit from "../../kits/typography/TypographyKit";
import DatePickerKit from "../../kits/datePicker/DatePickerKit";
import ButtonKit from "../../kits/button/ButtonKit";
import useDate from "../../hooks/useDate";
import { DateSelect } from "./DateSelect";
import RightDateSelect from "./RightDateSelect";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LocalizationProviderKit from "../../kits/localizationProvider/LocalizationProviderkit";
import MonthPickerKit from "../../kits/monthPicker/MonthPickerKit";

const Dates = () => {
  const { setLeft, setRight } = useDate();
  const [opened, setOpened] = useState(false);
  const [openedRight, setOpenedRight] = useState(false);
  const [selected, setSelected] = useState(false)
  const [expanded, setExpanded] = useState("panel1")
  const [leftDateBtn, setLeftDateBtn] = useState({ startDate: new Date(), endDate: new Date() })
  const [rightDateBtn, setRightDateBtn] = useState({ startDate: new Date(), endDate: new Date() })
  const [typeDate, setTypeDate] = useState("day");
  const [title, setTitle] = useState("today")
  const [titleRight, setTitleRight] = useState("today")
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
    setRightDateBtn({ startDate: startDate, endDate: endDate })

    const date = new Date()

    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();
    const dateLocal = date.toLocaleDateString();

    if (startLocal === endLocal) {
      if (startLocal === dateLocal) {
        setTitle("today")
      }
      else if (startLocal === (subDays(date, 1).toLocaleDateString())) {
        setTitle("yesterday")
      }
      else {
        setTitle("custom")
      }
    }
    else if (
      getWeek(startDate, 1) === getWeek(endDate, 1)) {
      if (endGetDay === dateGetDay && startGetDay === 0) {
        setTitle("current week")
      }
      else if (startGetDay === 0 && endGetDay === 6 && getWeek(startDate) === getWeek(subWeeks(date, 1))) {
        setTitle("last week")
      }
      else {
        setTitle("custom")
      }
    }
    else if (
      getMonth(startDate, 1) === getMonth(date, 1)
    ) {

      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        setTitle("current month")
      }
      else if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitle("last month")
      }
      else {
        setTitle("custom")
      }
    }
    else {
      if (startGetDate === 1 && endGetDate <= dateGetDate && endGetDate === endOfMonth(endDate).getDate()) {
        setTitle("current month")
      }
      else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitle("last month")
      }
      else {
        setTitle("custom")
      }
    }

  };
  const handleClickRight = () => {
    const startDate = new Date(rightDate[0].startDate);
    const endDate = new Date(rightDate[0].endDate);
    setRightDateBtn({ startDate: startDate, endDate: endDate })
    setOpenedRight(false)
    setSelected(false)
    setRight({ startDate: startDate, endDate: endDate })
    const date = new Date()
    const startLocal = startDate.toLocaleDateString();
    const endLocal = endDate.toLocaleDateString();
    const startGetDate = startDate.getDate();
    const endGetDate = endDate.getDate();
    const startGetDay = startDate.getDay();
    const endGetDay = endDate.getDay();
    const dateGetDay = date.getDay();
    const dateGetDate = date.getDate();
    const dateLocal = date.toLocaleDateString();

    if (startLocal === endLocal) {
      if (startLocal === dateLocal) {
        setTitleRight("today")
      }
      else if (startLocal === (subDays(date, 1).toLocaleDateString())) {
        setTitleRight("yesterday")
      }
      else {
        setTitleRight("custom")
      }
    }
    else if (
      getWeek(startDate, 1) === getWeek(endDate, 1)) {
      if (endGetDay === dateGetDay && startGetDay === 0) {
        setTitleRight("current week")
      }
      else if (startGetDay === 0 && endGetDay === 6 && getWeek(startDate) === getWeek(subWeeks(date, 1))) {
        setTitleRight("last week")
      }
      else {
        setTitleRight("custom")
      }
    }
    else if (
      getMonth(startDate, 1) === getMonth(date, 1)
    ) {

      if (startGetDate === 1 && endGetDate === endOfMonth(startDate).getDate()) {
        setTitleRight("current month")
      }
      else if (startGetDate === 1 && endGetDate === dateGetDate) {
        setTitleRight("last month")
      }
      else {
        setTitleRight("custom")
      }
    }
    else {
      if (startGetDate === 1 && endGetDate <= dateGetDate && endGetDate === endOfMonth(endDate).getDate()) {
        setTitleRight("current month")
      }
      else if (getMonth(startDate, 1) === getMonth(subMonths(date, 1))) {
        setTitleRight("last month")
      }
      else {
        setTitleRight("custom")
      }
    }

  }

  const handleOnChangeRight = ranges => {
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      if (typeDate === "day") {
        setRightDate([selection]);
      }
      else if (typeDate === "week") {
        setRightDate([{
          startDate: startOfWeek(selection.startDate),
          endDate: getWeek(new Date()) === getWeek(selection.startDate) ? new Date() : endOfWeek(selection.startDate),
          key: "selection"
        }])
      }
    }
    else {
      if (typeDate === "day") {
        setRightDate([selection]);
      }
      else if (typeDate === "week") {
        setRightDate([{
          startDate: startOfWeek(selection.startDate),
          endDate: endOfWeek(selection.startDate),
          key: "selection"
        }])
      }
    }
  }

  const handleOnChange = ranges => {
    const { selection } = ranges;
    if (getMonth(selection.startDate) === getMonth(new Date())) {
      if (typeDate === "day") {
        setLeftDate([selection]);
      }
      else if (typeDate === "week") {
        setLeftDate([{
          startDate: startOfWeek(selection.startDate),
          endDate: getWeek(new Date()) === getWeek(selection.startDate) ? new Date() : endOfWeek(selection.startDate),
          key: "selection"
        }])
      }
    }
    else {
      if (typeDate === "day") {
        setLeftDate([selection]);
      }
      else if (typeDate === "week") {
        setLeftDate([{
          startDate: startOfWeek(selection.startDate),
          endDate: endOfWeek(selection.startDate),
          key: "selection"
        }])
      }
    }
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
  const minDate = dayjs('2021-01-01T00:00:00.000');
  const maxDate = new Date()
  return (
    <div className="dates">
      <div className="date-picker_wrapper">
        <PaperKit component="div" onClick={() => setOpened(true)} className="date-input">
          <TypographyKit className="date-typography">
            <CalendarMonthIcon />
            <span>{
              title === "custom" ?
                new Date(leftDateBtn.startDate).toLocaleDateString() ===
                  new Date(leftDateBtn.endDate).toLocaleDateString() ? new Date(leftDateBtn.startDate).toLocaleDateString()
                  : new Date(leftDateBtn.startDate).toLocaleDateString() +
                  " - " + new Date(leftDateBtn.endDate).toLocaleDateString() :
                title
            }</span>
          </TypographyKit>
          <ExpandMoreIcon />
        </PaperKit>

      </div>
      <div
        className={
          "date-range " + (opened ? "opened " : "") +
          (typeDate === "month" ? "month" : "")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <PaperKit className="date-picker">
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"1"}
            type={"day"}
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"2"}
            type={"week"}
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"3"}
            type={"month"}
            setSelections={setLeftDate}
            setTypeDate={setTypeDate}
            leftDate={leftDate}
          />
          <div className="date-btn-wrapper">
            <ButtonKit
              onClick={handleClick}
              className={"date-save-btn "} variant={"contained"}>
              Ok
            </ButtonKit>
          </div>
        </PaperKit>
        {
          typeDate === "month" ?
            <LocalizationProviderKit dateAdapter={AdapterDayjs}>
              <MonthPickerKit
                className="month_picker"
                date={dayjs(leftDate[0].startDate)}
                minDate={minDate}
                maxDate={maxDate}
                onChange={(newDateMonth) => setLeftDate([{
                  startDate: startOfMonth(new Date(newDateMonth)),
                  endDate: endOfMonth(new Date(newDateMonth)),
                  key: "selection"
                }])}
              />
            </LocalizationProviderKit>
            :
            <DatePickerKit
              minDate={new Date(minDate)}
              maxDate={new Date()}
              onChange={handleOnChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={leftDate}
              direction="horizontal"
              dragSelectionEnabled={false}
            />
        }
      </div>
      <span>Compare to</span>
      <div className="date-picker_wrapper">
        <TypographyKit component="div" className="date-input-wrapper">
          <PaperKit onClick={() => setSelected(!selected)} className={"date-input " + (selected ? "selected" : "")}>
            <TypographyKit component="div" className="date-typography">
              <CalendarMonthIcon />
              <span>
                {
                  titleRight === "custom" ?
                    new Date(rightDateBtn.startDate).toLocaleDateString() ===
                      new Date(rightDateBtn.endDate).toLocaleDateString() ?
                      new Date(rightDateBtn.startDate).toLocaleDateString() :
                      new Date(rightDateBtn.startDate).toLocaleDateString() +
                      " - " + new Date(rightDateBtn.endDate).toLocaleDateString() :
                    titleRight
                }
              </span>
            </TypographyKit>
            <ExpandMoreIcon />
          </PaperKit>
          <RightDateSelect
            setRight={setRight}
            setRightDateBtn={setRightDateBtn}
            setOpenedRight={setOpenedRight}
            setRightDate={setRightDate}
            selected={selected}
            leftDate={leftDateBtn}
            setTitleRight={setTitleRight}
          />
        </TypographyKit>

      </div>
      <div
        className={
          "date-range range-right " +
          (openedRight ? "opened" : "")}
        onClick={(e) => e.stopPropagation()}
      >
        <PaperKit className="date-picker">
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"1"}
            type={"day"}
            setSelections={setRightDate}
            setTypeDate={setTypeDate}
            leftDate={rightDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"2"}
            type={"week"}
            setSelections={setRightDate}
            setTypeDate={setTypeDate}
            leftDate={rightDate}
          />
          <DateSelect
            expanded={expanded}
            setExpanded={setExpanded}
            index={"3"}
            type={"month"}
            setSelections={setRightDate}
            setTypeDate={setTypeDate}
            leftDate={rightDate}
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
        {
          typeDate === "month" ?
            <LocalizationProviderKit dateAdapter={AdapterDayjs}>
              <MonthPickerKit
                className="month_picker"
                date={dayjs(rightDate[0].startDate)}
                minDate={minDate}
                maxDate={maxDate}
                onChange={(newDateMonth) => setRightDate([{
                  startDate: startOfMonth(new Date(newDateMonth)),
                  endDate: endOfMonth(new Date(newDateMonth)),
                  key: "selection"
                }])}
              />
            </LocalizationProviderKit>
            :
            <DatePickerKit
              minDate={new Date(minDate)}
              maxDate={new Date()}
              onChange={handleOnChangeRight}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={rightDate}
              direction="horizontal"
              dragSelectionEnabled={false}
            />
        }
      </div>
      <div className={"date-range-overlay " + (opened ? "opened" : "")} onClick={() => setOpened(false)}></div>
      <div className={"date-range-overlay " + (openedRight ? "opened" : "")} onClick={() => setOpenedRight(false)}></div>
    </div>

  );
};

Dates.propTypes = {
  onChange: PropTypes.func,
};

export default React.memo(Dates);
