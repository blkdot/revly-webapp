import React from "react";
import { NavLink } from "react-router-dom";
import Dates from "../../components/dates/Dates";
import PlanningAdsTable from "../../components/planningAdsTable/PlanningAdsTable";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { PlanningAdsData, restaurantNames } from "../../data/fakeDataDashboard";
import "./Planning.scss";

const PlanningAds = () => {
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown names={restaurantNames} />
        <Dates />
      </div>
      <div className="planning_top-nav">
        <NavLink to={"/planning/offers"}>Offers</NavLink>
        <NavLink to={"/planning/ads"}>Ads</NavLink>
      </div>
      <PlanningAdsTable rows={PlanningAdsData}/>
    </div>
  );
}

export default PlanningAds;
