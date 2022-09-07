import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Dates.scss"
import React from "react";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TypographyKit from "../../kits/typography/TypographyKit";
import ButtonKit from "../../kits/button/ButtonKit";
import AccordionSummaryKit from "../../kits/accordionSummary/AccordionSummaryKit";
import AccordionKit from "../../kits/accordion/AccordionKit";
import AccordionDetailsKit from "../../kits/accordionDetails/AccordionDetails";

export const DateSelect = ({ type, setSelections, setRightDate, expanded, setExpanded, index }) => {
  const getDate = (type) => {
    const date = new Date()
    switch (type) {
      case "today":
        setSelections([{ startDate: date, endDate: date, key: "selection" }])
        setRightDate([{ startDate: date, endDate: date, key: "selection" }])
        break;
      case "yesterday":
        setSelections([{ startDate: subDays(date, 1), endDate: subDays(date, 1), key: "selection" }])
        setRightDate([{ startDate: subDays(date, 1), endDate: subDays(date, 1), key: "selection" }])
        break;
      case "week":
        setSelections([{ startDate: startOfWeek(date), endDate: date, key: "selection" }])
        setRightDate([{ startDate: startOfWeek(date), endDate: date, key: "selection" }])
        break;
      case "last week":
        setSelections([{ startDate: startOfWeek(subWeeks(date, 1)), endDate: endOfWeek(subWeeks(date, 1)), key: "selection" }])
        setRightDate([{ startDate: startOfWeek(subWeeks(date, 1)), endDate: endOfWeek(subWeeks(date, 1)), key: "selection" }])
        break;
      case "month":
        setSelections([{ startDate: startOfMonth(date), endDate: date, key: "selection" }])
        setRightDate([{ startDate: startOfMonth(date), endDate: date, key: "selection" }])
        break;
      case "last month":
        setSelections([{ startDate: startOfMonth(subMonths(date, 1)), endDate: endOfMonth(subMonths(date, 1)), key: "selection" }])
        setRightDate([{ startDate: startOfMonth(subMonths(date, 1)), endDate: endOfMonth(subMonths(date, 1)), key: "selection" }])
    }
  }
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <AccordionKit
      aria-controls={"panel" + index + "bh-content"}
      id={"panel" + index + "bh-header"}
      expanded={expanded === ("panel" + index)}
      onChange={handleChange("panel" + index)}
      className="navbar-accordion">
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