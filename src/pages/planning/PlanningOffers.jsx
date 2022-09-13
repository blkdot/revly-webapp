import React from "react";
import { NavLink } from "react-router-dom";
import Dates from "../../components/dates/Dates";
import PlanningOffersTable from "../../components/PlanningOfferTable/PlanningOffersTable";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { restaurantNames } from "../../data/fakeDataDashboard";
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
      <PlanningOffersTable />
    </div>
  );
}

export default PlanningOffers;
