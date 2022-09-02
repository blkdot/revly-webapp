import React, { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import GroupsIcon from '@mui/icons-material/Groups';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';

import "./Navbar.scss";

import { useUserAuth } from '../../contexts/AuthContext';
import logo from "../../assets/images/logo.png";
import smallLogo from "../../assets/images/small-logo.png";
import AccordionSummaryKit from "../../kits/accordionSummary/AccordionSummaryKit";
import AccordionKit from "../../kits/accordion/AccordionKit";
import AccordionDetailsKit from "../../kits/accordionDetails/AccordionDetails";
import TypographyKit from "../../kits/typography/TypographyKit";
import ButtonKit from "../../kits/button/ButtonKit";

const Link = ({ path, title, children }) => {
  return (
    <NavLink to={path}>
      <ButtonKit className="navbar-button-kit">
        {children}
        <span>{title}</span>
      </ButtonKit>
    </NavLink>
  )
}

function Navbar() {
  const [opened, setOpened] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      console.log(`${user.email} is logged out`);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className={"navbar_wrapper " + (opened ? "opened" : " ")}>
      <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className={"Navbar " + (opened || open ? "opened" : "")}>
        <ul >
          <li className="Navbar_logo">
            {
              opened || open ? <img className="nav-logo" src={logo} alt="Revly" /> : <img className="nav-small-logo" src={smallLogo} alt="Revly" />
            }
            <ButtonKit
              onClick={() => setOpened(!opened)}
              className={"nav-double-arrow " + (opened ? "active" : "")}
            >
              <KeyboardDoubleArrowRightIcon />
            </ButtonKit>
          </li>
          <Link title={"Dashboard"} path={"/dashboard"}>
            <DashboardIcon />
          </Link>
          <Link title={"Planning"} path={"/planning"}>
            <CalendarMonthIcon />
          </Link>
          <AccordionKit onClick={() => setExpanded(!expanded)} className="navbar-accordion" expanded={opened || open ? expanded : false}>
            <ButtonKit className="navbar-button-kit">
              <AccordionSummaryKit className="accordion-sum" expandIcon={opened || open ? <ExpandMoreIcon /> : ""}>
                <TypographyKit sx={{ display: "flex", alignItems: "center", gridGap: "5px", fontSize: "14px" }}>
                  <StackedLineChartIcon />
                  <span>Marketing</span>
                </TypographyKit>
              </AccordionSummaryKit>
            </ButtonKit>
            <AccordionDetailsKit className="navbar-accordion-details">
              <Link path={"/offer"}>Offer</Link>
              <Link path={"/ads"}>Ads</Link>
            </AccordionDetailsKit>
          </AccordionKit>
          <Link title={"Competition"} path={"/competition"}>
            <GroupsIcon />
          </Link>
        </ul>
        <ul className="Navbar-footer">
          <Link title={"Settings"} path={"/settings"}>
            <SettingsIcon />
          </Link>
          <li onClick={handleLogout}>
            <ButtonKit className="navbar-button-kit">
              <LogoutIcon />
              <span>Log Out</span>
            </ButtonKit>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
