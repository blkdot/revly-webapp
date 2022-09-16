import React from "react";
import Dates from "../../components/dates/Dates";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { restaurantNames } from "../../data/fakeDataDashboard";

const MarketingOffer = () => {
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown names={restaurantNames} />
        <Dates />
      </div>

    </div>
  );
};

export default MarketingOffer;