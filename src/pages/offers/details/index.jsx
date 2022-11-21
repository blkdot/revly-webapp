/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import MenuItem from './MenuItem';
import Dates from '../../../components/dates/Dates';
import RestaurantDropdown from '../../../components/restaurantDropdown/RestaurantDropdown.suspended';
import ButtonKit from '../../../kits/button/ButtonKit';
import TypographyKit from '../../../kits/typography/TypographyKit';
import SmartRuleBtnIcon from '../../../assets/images/ic_sm-rule.png';
import SettingFuture from '../../../assets/images/ic_setting-future.png';
import useDate from '../../../hooks/useDate';
import PaperKit from '../../../kits/paper/PaperKit';
import Arrow from '../../../assets/icons/Arrow';
import Warning from '../../../assets/icons/Warning';
import Calendar from '../../../assets/icons/Calendar';
import Trash from '../../../assets/icons/Trash';
import Timer from '../../../assets/icons/Timer';
import ExpandIcon from '../../../assets/icons/ExpandIcon';
import FastFood from '../../../assets/icons/FastFood';

import { platformObject } from '../../../data/platformList';
import './OfferDetails.scss';
import useApi from '../../../hooks/useApi';
import config from '../../../setup/config';
import { useUserAuth } from '../../../contexts/AuthContext';
import { usePlatform } from '../../../hooks/usePlatform';
import CancelOfferModal from '../../../components/modals/cancelOfferModal';
import useVendors from '../../../hooks/useVendors';
import MarketingSetup from '../../../components/marketingSetup/MarketingSetup';
import RestaurantDropdownOld from '../../../components/restaurantDropdown/RestaurantDropdownOld';
import { getPlanningOfferDetails } from '../../../api/userApi';

const scheduleTypeMapping = {
  once: 'Once',
  now: 'Now',
  workweek: 'Work week',
  everyday: 'Everyday',
};

const OfferDetailComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const {
    state: { offerDetail: data, prevPath },
  } = useLocation();
  const [offerDetail, setOfferDetail] = useState(data);
  // eslint-disable-next-line
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const {
    userPlatformData: { platforms },
  } = usePlatform();
  const { cancelOffer } = useApi();
  const { environment } = config;
  const { user } = useUserAuth();
  const { date } = useDate();
  const { vendors } = useVendors();
  const { vendorsArr, restaurants, vendorsObj, display, chainObj } = vendors;
  const [beforePeriodBtn, setbeforePeriodBtn] = useState({
    startDate: date.beforePeriod.startDate,
    endDate: date.beforePeriod.endDate,
  });
  const [active, setActive] = useState(false);
  const renderOfferStatus = (status) => {
    const statusColor = {
      cancelled: ['#ff4842', 'rgba(255, 72, 66, 0.08)'],
      active: ['#229A16', 'rgba(84, 214, 44, 0.16)'],
      ended: ['#161C24', 'rgba(145, 158, 171, 0.12)'],
      scheduled: ['#1890FF', 'rgba(24, 144, 255, 0.16)'],
      paused: ['#ff4842', 'rgba(255, 72, 66, 0.08)'],
      live: ['#229A16', 'rgba(84, 214, 44, 0.16)'],
      default: ['#161C24', 'rgba(145, 158, 171, 0.12)'],
    };
    return (
      <div>
        <span className="offer-title">Offer Status :</span>
        <span
          className="offer-status"
          style={{
            color: (statusColor[status.toLowerCase()] || statusColor.default)[0],
            backgroundColor: (statusColor[status.toLowerCase()] || statusColor.default)[1],
          }}
        >
          {status}
        </span>
      </div>
    );
  };
  const renderPlatform = (platform) => (
    <div style={{ display: 'flex' }}>
      <span className="offer-title">Platform :</span>
      <span className="offer-sub-title">
        <img
          className="planning-platform"
          style={{ marginRight: '1.5rem' }}
          src={platformObject[platform].src}
          alt={platformObject[platform].name}
        />
      </span>
    </div>
  );

  const {
    data: offerData,
    discount_rate,
    discount_type,
    end_date,
    master_offer_id,
    // menu_items,
    minimum_order_value,
    platform,
    start_date,
    status,
    vendor_name,
    vendor_id,
    offer_id,
    type_schedule,
  } = offerDetail;
  const vendor = vendorsObj[platform]?.find((v) => v.vendor_id === `${offerDetail.vendor_id}`);
  const chain_id = vendor ? vendor.chain_id : '';

  const openCancelModal = () => setIsOpen(true);

  const handleCancelOffer = () => {
    cancelOffer(
      {
        master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
        access_token: '',
        platform_token: platforms[platform].access_token,
        vendors: [vendor],
        offer_id,
        chain_id,
      },
      platform,
    ).then((res) => {
      setOfferDetail({ ...offerDetail, status: res.data.status });
      setIsOpen(false);
    });
  };

  const OpenSetup = () => {
    const body = document.querySelector('body');
    setActive(true);
    body.style.overflowY = 'hidden';
  };

  useEffect(() => {
    getPlanningOfferDetails({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsObj,
      platform,
      master_offer_id,
    })
      .then((res) => setMenu(res.data))
      // eslint-disable-next-line no-console
      .catch((err) => console.log({ err }));
  }, [vendors]);

  return (
    <>
      <CancelOfferModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        cancelOffer={handleCancelOffer}
      />
      <MarketingSetup active={active} setActive={setActive} />
      <div className="wrapper marketing-wrapper">
        <div className="top-inputs">
          {Object.keys(display).length > 0 ? (
            <RestaurantDropdown chainObj={chainObj} />
          ) : (
            <RestaurantDropdownOld
              restaurants={restaurants}
              vendors={vendorsArr}
              vendorsPlatform={Object.keys(vendorsObj)}
            />
          )}
          <Dates beforePeriodBtn={beforePeriodBtn} setbeforePeriodBtn={setbeforePeriodBtn} />
        </div>
        {prevPath === '/marketing/offer' ? (
          <div className="marketing-top">
            <div className="marketing-top-text">
              <TypographyKit variant="h4">Marketing - Offers</TypographyKit>
              <TypographyKit color="#637381" variant="subtitle">
                Create and manage all your offers. Set personalised rules to automatically trigger
                your offers.
              </TypographyKit>
            </div>
            <div className="markting-top-btns">
              <ButtonKit disabled className="sm-rule-btn disabled" variant="outlined">
                <img src={SmartRuleBtnIcon} alt="Smart rule icon" />
                Create a smart rule
              </ButtonKit>
              <ButtonKit onClick={() => OpenSetup()} variant="contained">
                <img src={SettingFuture} alt="Setting future icon" />
                Set up an offer
              </ButtonKit>
            </div>
          </div>
        ) : null}
        <PaperKit className="marketing-paper offer-paper">
          <div>
            <div className="offer-details-actions">
              <button onClick={() => navigate(prevPath)} type="button" className="back-icon">
                <Arrow />
                <span style={{ paddingLeft: '5px' }}>Back</span>
              </button>
              <div>
                {['Live', 'Active', 'Scheduled'].includes(status) && (
                  <button onClick={openCancelModal} className="cancel-btn" type="button">
                    <Warning />
                    <span style={{ color: '#FF4842' }}>Cancel Offer</span>
                  </button>
                )}
              </div>
            </div>
            <div className="offer-infos">
              <div className="restau">
                <Calendar />
                <div className="restau-infos">
                  <div className="restau-name">{vendor_name}</div>
                </div>
              </div>
              <div className="offer">
                {renderOfferStatus(status)}
                <div>
                  <span className="offer-title">Offer Date :</span>
                  <span className="offer-sub-title">{start_date}</span>
                </div>
                {renderPlatform(platform)}
              </div>
            </div>
            {status !== 'Scheduled' && (
              <div className="offer-visibility-container">
                <div className="offer-visibility-block">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="offer-visibility-title with-icon">Caroussel Visibility</span>
                    <Arrow />
                  </div>
                  <div className="offer-visibility-sub-title">Caroussel</div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">Visibility Rank</span>
                  </div>
                  <div className="offer-visibility-sub-title">
                    {offerData?.accrued_discount || '-'}
                  </div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">#Orders</span>
                  </div>
                  <div className="offer-visibility-sub-title">{offerData?.n_orders || '-'}</div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">Avg Basket</span>
                  </div>
                  <div className="offer-visibility-sub-title">
                    {offerData?.average_basket || '-'}
                  </div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">Roi</span>
                  </div>
                  <div className="offer-visibility-sub-title">{offerData?.roi || '-'}</div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">Revenue</span>
                  </div>
                  <div className="offer-visibility-sub-title">{offerData?.revenue || '-'}</div>
                </div>
                <div className="offer-visibility-block">
                  <div>
                    <span className="offer-visibility-title">Profits</span>
                  </div>
                  <div className="offer-visibility-sub-title">
                    {(offerData && (offerData.revenue - offerData.accrued_discount).toFixed(2)) ||
                      '-'}
                  </div>
                </div>
              </div>
            )}
            {!master_offer_id && (
              <>
                <div className="offer-duration-container">
                  <div className="offer-duration-block">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          background: 'rgba(144, 107, 255, 0.08)',
                          padding: '5px',
                          borderRadius: '50px',
                        }}
                      >
                        <Timer />
                      </div>
                      <span className="offer-duration width-left-icon width-right-icon">
                        Program the offer duration
                      </span>
                      <ExpandIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="offer-duration  width-right-icon">
                        {scheduleTypeMapping[type_schedule] || 'Customised day'}
                      </span>
                      <ExpandIcon />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="offer-duration">Monday, Thursday, Sunday</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flex: '1',
                      justifyContent: 'space-around',
                      minHeight: '36px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Public Sans',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: '12px',
                          lineHeight: '18px',
                          color: '#212B36',
                        }}
                      >
                        Starting date
                      </div>
                      <div
                        style={{
                          fontFamily: 'Public Sans',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: '14px',
                          lineHeight: '22px',
                          color: '#212B36',
                        }}
                      >
                        {start_date}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Public Sans',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: '12px',
                          lineHeight: '18px',
                          color: '#212B36',
                        }}
                      >
                        Ending date
                      </div>
                      <div
                        style={{
                          fontFamily: 'Public Sans',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: '14px',
                          lineHeight: '22px',
                          color: '#212B36',
                        }}
                      >
                        {end_date}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="offerdetails_time_slots_scroll">
                  <div className="offerdetails_time_slots">
                    <TimeSlot status={status} />
                    <TimeSlot status={status} />
                    <TimeSlot status={status} />
                    <TimeSlot status={status} />
                    <TimeSlot status={status} />
                    <TimeSlot status={status} />
                  </div>
                </div>
              </>
            )}
            <div className="offer-duration-container">
              <div className="offer-duration-block">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      background: 'rgba(144, 107, 255, 0.08)',
                      padding: '5px',
                      borderRadius: '50px',
                      cursor: 'pointer',
                    }}
                  >
                    <FastFood />
                  </div>
                  <span className="offer-duration width-left-icon width-right-icon">
                    {discount_type && discount_type !== 'Menu discount'
                      ? 'Offer on an item from the Menu'
                      : 'Offer on the whole Menu'}
                  </span>
                  <ExpandIcon />
                </div>
                {discount_type && discount_type !== 'Menu discount' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Public Sans',
                        fontStyle: 'normal',
                        fontWeight: '600',
                        fontSize: '14px',
                        lineHeight: '22px',
                        color: '#212B36',
                      }}
                    >
                      {discount_type}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Public Sans',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '12px',
                        lineHeight: '18px',
                        color: '#637381',
                      }}
                    >
                      Sell Off extra stock when you’re about to close
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flex: '1', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '18px',
                      color: '#212B36',
                    }}
                  >
                    Percentage Discount
                  </div>
                  <div
                    style={{
                      fontFamily: 'Public Sans',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#212B36',
                    }}
                  >
                    {`${discount_rate}%`}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Public Sans',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '18px',
                      color: '#212B36',
                    }}
                  >
                    Min Order
                  </div>
                  <div
                    style={{
                      fontFamily: 'Public Sans',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#212B36',
                    }}
                  >
                    {minimum_order_value} AED
                  </div>
                </div>
              </div>
            </div>
            {discount_type &&
              discount_type !== 'Menu discount' &&
              [
                { drn_id: 'e8cee7b9-f191-4392-8f53-8d019ee02c41' },
                { drn_id: '5a9e1ab0-69a2-48b8-bed3-2858b5b9aa1d' },
              ].map((menuItem) => (
                <MenuItem
                  key={menuItem.drn_id}
                  drnId={menuItem.drn_id}
                  discountRate={discount_rate}
                  platform={platform}
                  vendorId={vendor_id}
                />
              ))}
          </div>
        </PaperKit>
      </div>
    </>
  );
};
export default OfferDetailComponent;

// eslint-disable-next-line no-unused-vars
const TimeSlot = () => (
  <div
    style={{
      display: 'flex',
      marginLeft: '30px',
      width: '200px',
      borderRight: 'solid 1px rgba(145, 158, 171, 0.24)',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          height: 'fit-content',
        }}
      >
        <span
          style={{
            fontFamily: 'Public Sans',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '12px',
            lineHeight: '18px',
            color: '#212B36',
          }}
        >
          Date
        </span>
        <span
          style={{
            fontFamily: 'Public Sans',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '22px',
            textAlign: 'center',
            color: '#212B36',
          }}
        >
          15/11/22
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '40px',
          gridGap: '15px',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '18px',
              color: '#212B36',
            }}
          >
            Start time
          </span>
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '22px',
              textAlign: 'center',
              color: '#212B36',
            }}
          >
            10 am
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '18px',
              color: '#212B36',
            }}
          >
            End time
          </span>
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '22px',
              textAlign: 'center',
              color: '#212B36',
            }}
          >
            10 am
          </span>
        </div>
      </div>
    </div>
    <span className="cancel_api">
      <Trash />
    </span>
  </div>
);
