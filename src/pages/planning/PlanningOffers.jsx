import React from "react";
import { NavLink } from "react-router-dom";
import Dates from "../../components/dates/Dates";
import PlanningOffersTable from "../../components/planningOffersTable/PlanningOffersTable";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { PlanningOffersData, restaurantNames } from "../../data/fakeDataDashboard";
import "./Planning.scss";

const PlanningOffers = () => {
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
      <PlanningOffersTable rows={PlanningOffersData}/>
    </div>
  );
}

export default PlanningOffers;
