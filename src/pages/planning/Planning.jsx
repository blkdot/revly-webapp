import React, { useState } from "react";
import Dates from "../../components/dates/Dates";
import PlanningAdsTable from "../../components/planningAdsTable/PlanningAdsTable";
import PlanningOffersTable from "../../components/planningOffersTable/PlanningOffersTable";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { PlanningAdsData, PlanningOffersData, restaurantNames } from "../../data/fakeDataDashboard";
import TypographyKit from "../../kits/typography/TypographyKit";
import "./Planning.scss";

const Planning = () => {
  const [active, setActive] = useState(true)

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown names={restaurantNames} />
        <Dates />
      </div>
      <div className={"planning_top-nav " + (!active ? "active" : "")}>
        <TypographyKit
          className={active ? "active" : ""}
          onClick={() => setActive(true)}
          variant="h4"
        >
          Offers
        </TypographyKit>
        <TypographyKit
          className={!active ? "active" : ""}
          onClick={() => setActive(false)}
          variant="h4"
        >
          Ads
        </TypographyKit>
      </div>
      {
        active ? <PlanningOffersTable rows={PlanningOffersData} /> :
          <PlanningAdsTable rows={PlanningAdsData} />
      }
    </div>
  );
}

export default Planning;
