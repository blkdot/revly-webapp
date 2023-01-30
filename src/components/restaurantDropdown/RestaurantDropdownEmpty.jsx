import React from 'react';
import SkeletonKit from '../../kits/skeleton/SkeletonKit';
import TypographyKit from '../../kits/typography/TypographyKit';
import selectIcon from '../../assets/images/ic_select.png';

const RestaurantDropdownEmpty = () => (
  <div className="restaurant-dropdown_wrapper">
    <TypographyKit className="top-text-inputs" variant="subtitle">
      Select a Vendor
    </TypographyKit>
    <div className="selected-dropdown">
      <img className="select_icon" src={selectIcon} alt="Select Icon" />
      <div className="selected-dropdown_skeleton">
        <SkeletonKit />
        <SkeletonKit />
      </div>
    </div>
  </div>
);

export default RestaurantDropdownEmpty;
