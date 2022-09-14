import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React from "react";
import { endOfMonth, getWeek, subDays, subMonths, subWeeks, getMonth } from "date-fns";
import PaperKit from "../../kits/paper/PaperKit";
import ButtonKit from "../../kits/button/ButtonKit";

const RightDateSelect = ({ setRightDate, leftDate, selected, setOpenedRight, setRightDateBtn,setTitleRight }) => {
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
    setRightDate([{ startDate: startDate, endDate: endDate, key: "selection" }])
    setRightDateBtn({ startDate: startDate, endDate: endDate })
    setOpenedRight(true)
  }

  const Day = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => {setRightDateBtn(
            {
              startDate: subDays(startDate, 1),
              endDate: subDays(endDate, 1),
            })
            setTitleRight("day - 1")
            }}>Day - 1</ButtonKit>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => {setRightDateBtn(
            {
              startDate: subWeeks(startDate, 1),
              endDate: subWeeks(endDate, 1),
            })
            setTitleRight("Same day last week")
          }}
        >Same day last week</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Day</ButtonKit>
      </div>
    )
  }
  const Week = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => {setRightDateBtn(
            {
              startDate: subWeeks(startDate, 1),
              endDate: subWeeks(endDate, 1),
            })
            setTitleRight("Week - 1")
            }}>Week - 1</ButtonKit>
        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Week</ButtonKit>
      </div >
    )
  }
  const Month = () => {
    return (
      <div>
        <ButtonKit
          className="navbar-button-kit"
          onClick={() => {setRightDateBtn  (
            {
              startDate: subMonths(startDate, 1),
              endDate: subMonths(endDate, 1),
            })
            setTitleRight("Month - 1")
            }}>Month - 1</ButtonKit>

        <ButtonKit className="navbar-button-kit" onClick={openRight}>Custom Month</ButtonKit>
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
  }
  return (
    <PaperKit style={{ background: '#fff' }} className={"date-select " + (selected ? "selected" : "")}>
      {render()}
    </PaperKit >
  )
}

export default React.memo(RightDateSelect)
