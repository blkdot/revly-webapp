import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React from "react";
import { endOfMonth, getWeek, subDays, subMonths, subWeeks, getMonth, getDate } from "date-fns";
import PaperKit from "../../kits/paper/PaperKit";
import ButtonKit from "../../kits/button/ButtonKit";

const RightDateSelect = ({ setRightDate, leftDate, selected, setOpenedRight }) => {
  const startDate = new Date(leftDate.startDate);
  const endDate = new Date(leftDate.endDate);
  const date = new Date();
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const startGetDay = startDate.getDay();
  const endGetDay = endDate.getDay();
  const dateGetDay = date.getDay();
  const dateGetDate = date.getDate();


  const openRight = () => {
    setRightDate([{ startDate: new Date(), endDate: new Date(), key: "selection" }])
    setOpenedRight(true)
  }

  const Day = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => setRightDate(
            [{
              startDate: subDays(startDate, 1),
              endDate: subDays(endDate, 1),
              key: "selection"
            }]
          )}>Day - 1</ButtonKit>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => setRightDate(
            [{
              startDate: subWeeks(startDate, 1),
              endDate: subWeeks(endDate, 1),
              key: "selection"
            }]
          )}
        >Same day last week</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Date</ButtonKit>
      </div>
    )
  }
  const Week = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => setRightDate(
            [{
              startDate: subWeeks(startDate, 1),
              endDate: subWeeks(endDate, 1),
              key: "selection"
            }]
          )}>Week - 1</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Date</ButtonKit>
      </div >
    )
  }
  const Month = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => setRightDate(
            [{
              startDate: subMonths(startDate, 1),
              endDate: subMonths(endDate, 1),
              key: "selection"
            }]
          )}>Month - 1</ButtonKit>

        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Date</ButtonKit>
      </div>
    )
  }
  const DateCustom = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => setRightDate(
            [{
              startDate: subDays(startDate, (getDate(endDate) - getDate(startDate) + 1)),
              endDate: subDays(endDate, (getDate(endDate) - getDate(startDate) + 1)),
              key: "selection"
            }]
          )}>Date - 1</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Date</ButtonKit>
      </div>
    )
  }

  const render = () => {
    if (getMonth(startDate) === getMonth(date)) {
      if (startLocal === endLocal) return <Day />
      else if (
        getWeek(startDate) === getWeek(endDate) &&
        startGetDay === 0 && endGetDay >= dateGetDay &&
        endGetDay <= 6
      ) return <Week />
      else if (
        getMonth(startDate) === getMonth(endDate) &&
        startGetDate === 1 && endGetDate >= dateGetDate &&
        endGetDate <= endOfMonth(endDate).getDate()
      ) return <Month />
      return <DateCustom />
    }
    else if (startLocal === endLocal) return <Day />
    else if (
      getWeek(startDate) === getWeek(endDate) &&
      startGetDay === 0 && endGetDay <= 6
    ) return <Week />
    else if (
      getMonth(startDate) === getMonth(endDate) &&
      startGetDate === 1 && endGetDate === endOfMonth(endDate, 1).getDate()
    ) return <Month />
    return <DateCustom />
  }
  return (
    <PaperKit className={"date-select " + (selected ? "selected" : "")}>
      {
        render()
      }
    </PaperKit >
  )
}

export default RightDateSelect
