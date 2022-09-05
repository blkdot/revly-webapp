import "./Dashboard.scss";
import React from "react";
import Dates from "../../components/dates/Dates";
import Finance from "../../components/finance/Finance";
import Marketing from "../../components/marketing/Marketing";
import RestaurantDropdown from "../../components/restaurantDropdown/RestaurantDropdown";
import { restaurantNames } from "../../data/fakeDataDashboard";

const Dashboard = () => {
  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown names={restaurantNames} />
        <Dates />
      </div>
      <Finance />
      <Marketing />
    </div>
  );
};

export default Dashboard;