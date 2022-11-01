import React, { useState } from 'react';
import './Planning.scss';
import Dates from '../../components/dates/Dates';
import RestaurantDropdown from '../../components/restaurantDropdown/RestaurantDropdown';
import useDate from '../../hooks/useDate';
import usePlanningOffers from '../../hooks/usePlanningOffers';
import usePlanningAds from '../../hooks/usePlanningAds';
import useVendors from '../../hooks/useVendors';
import TypographyKit from '../../kits/typography/TypographyKit';
import TableRevly from '../../components/tableRevly/TableRevly';
import useTableContentFormatter from '../../components/tableRevly/tableContentFormatter/useTableContentFormatter';
import offerIcon from '../../assets/images/ic_offers.png';
import adsIcon from '../../assets/images/ic_ads.png';
import PaperKit from '../../kits/paper/PaperKit';
import BoxKit from '../../kits/box/BoxKit';

const Planning = () => {
  const [active, setActive] = useState(1);
  const { date } = useDate();
  const [dateRange, setDateRange] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
  const { vendors, vendorsPlatform } = useVendors();
  const { offers, isLoading: isLoadingOffers } = usePlanningOffers({ dateRange });
  const { ads, isLoading: isLoadingAds } = usePlanningAds({ dateRange });

  const {
    renderPlatform,
    renderPercent,
    renderCurrency,
    renderStatus,
    renderSimpleRowNotCentered,
    renderTarget,
    renderScheduleType,
    renderSimpleRow,
  } = useTableContentFormatter();

  const headersOffers = [
    { id: 'vendor_name', disablePadding: true, label: 'Vendor name' },
    { id: 'platform', disablePadding: true, label: 'Platform' },
    { id: 'start_date', disablePadding: true, label: 'Start date' },
    { id: 'end_date', disablePadding: true, label: 'End date' },
    { id: 'type_schedule', disablePadding: true, label: 'Schedule type' },
    { id: 'discount_type', disablePadding: true, label: 'Discount type' },
    { id: 'discount_rate', disablePadding: true, label: 'Discount rate' },
    { id: 'minimum_order_value', disablePadding: true, label: 'Minimum order value' },
    { id: 'target', disablePadding: true, label: 'Target' },
    { id: 'status', disablePadding: true, label: 'Status' },
  ];

  const cellTemplatesObject = {
    vendor_name: renderSimpleRowNotCentered,
    platform: renderPlatform,
    start_date: renderSimpleRow,
    end_date: renderSimpleRow,
    type_schedule: renderScheduleType,
    discount_type: renderSimpleRow,
    discount_rate: renderPercent,
    minimum_order_value: renderCurrency,
    target: renderTarget,
    status: renderStatus,
  };

  const renderRowsByHeader = (r) =>
    headersOffers.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cellTemplatesObject[cur.id](r, cur),
        id: `${cur.id}_${r.offer_id}`,
      }),
      {},
    );

  const getOffersTable = () => (
    <TableRevly
      isLoading={isLoadingOffers}
      headers={headersOffers}
      rows={ads.map(renderRowsByHeader)}
    />
  );

  const getAdsTable = () => (
    <TableRevly
      isLoading={isLoadingAds}
      headers={headersOffers}
      rows={offers.map(renderRowsByHeader)}
    />
  );

  const renderTable = () => {
    if (active) return getOffersTable();

    return getAdsTable();
  };

  const renderLayout = () => (
    <PaperKit className="marketing-paper offer-paper">
      <div className="right-part">
        <div className="right-part-header marketing-links">
          <TypographyKit
            className={`right-part-header_link ${active ? 'active' : ''}`}
            variant="div"
          >
            <BoxKit className={!active ? 'active' : ''} onClick={() => setActive(0)}>
              <img src={offerIcon} alt="Offers managment icon" />
              Planning Offers
            </BoxKit>
            <BoxKit className={active ? 'active' : ''} onClick={() => setActive(1)}>
              <img src={adsIcon} alt="Offer Performence icon" />
              Planning Ads
            </BoxKit>
          </TypographyKit>
        </div>
      </div>
      {renderTable()}
    </PaperKit>
  );

  return (
    <div className="wrapper">
      <div className="top-inputs">
        <RestaurantDropdown vendors={vendors} vendorsPlatform={vendorsPlatform} />
        <Dates offer beforePeriodBtn={dateRange} setbeforePeriodBtn={setDateRange} />
      </div>
      {renderLayout()}
    </div>
  );
};

export default Planning;
