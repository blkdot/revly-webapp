/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Arrow, Calendar, ExpandIcon, FastFood, Timer, Warning } from 'assets/icons';
import { useUserAuth } from 'contexts';
import { format } from 'date-fns';
import { useApi, useVendors } from 'hooks';
import { PaperKit, SkeletonKit, SpinnerKit } from 'kits';
import { useState } from 'react';
import { getPlanningOfferDetails } from '../../../api/userApi';
import CancelOfferModal from '../../../components/modals/cancelOfferModal';
import { platformObject } from '../../../data/platformList';
import MenuItem from './MenuItem';
import './OfferDetails.scss';

const scheduleTypeMapping = {
  once: 'Once',
  now: 'Now',
  workweek: 'Work week',
  everyday: 'Everyday',
};

const OfferDetailComponent = ({ data, setOpened }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [offerDetail, setOfferDetail] = useState(data);
  // eslint-disable-next-line
  const [offerDetailMaster, setofferDetailMaster] = useState<any>({});

  const { cancelOfferMaster } = useApi();

  const { user } = useUserAuth();
  const { vendors, getChainData } = useVendors(undefined);
  const { display, vendorsObj } = vendors;
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className='offer-title'>Offer Status :</span>

        {status ? (
          <span
            className='offer-status'
            style={{
              color: (statusColor[status.toLowerCase()] || statusColor.default)[0],
              backgroundColor: (statusColor[status.toLowerCase()] || statusColor.default)[1],
            }}
          >
            {status}
          </span>
        ) : (
          <span>
            <SkeletonKit width={70} height={30} />
          </span>
        )}
      </div>
    );
  };
  const renderPlatform = (platform) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span className='offer-title'>Platform :</span>
      <span className='offer-sub-title'>
        <img
          className='planning-platform'
          style={{ marginRight: '1.5rem' }}
          src={platformObject[platform.toLowerCase()].src}
          alt={platformObject[platform.toLowerCase()].name}
        />
      </span>
    </div>
  );

  const { master_offer_id, platform } = offerDetail;
  const {
    profit,
    revenue,
    // accrued_discount,
    roi,
    average_basket,
    n_orders,
    minimum_order_value,
    start_date,
    end_date,
    status,
    vendor_ids,
    type_schedule,
    discount_rate,
    type_offer,
    chain_id,
  } = offerDetailMaster?.master_offer || {};

  const getToken = () => {
    let token = '';
    Object.keys(display).forEach((cName) => {
      Object.keys(display[cName]).forEach((vName) => {
        if (
          vendor_ids.includes(
            Number(display[cName][vName].platforms[platform.toLowerCase()]?.vendor_id || 0)
          )
        ) {
          token = display[cName][vName].platforms[platform.toLowerCase()].access_token;
        }
      });
    });
    return token;
  };

  const client = useQueryClient();

  const openCancelModal = () => setIsOpen(true);

  const handleCancelOfferMaster = () => {
    const vendor = vendorsObj[platform.toLowerCase()]?.filter((v) =>
      vendor_ids?.includes(Number(v.vendor_id))
    );

    cancelOfferMaster(
      {
        master_email: user.email,
        access_token: user?.accessToken || '',
        // TODO: check this
        platform_token: getToken(),
        offer_id: null,
        chain_id: String(chain_id),
        master_offer_id,
        vendors: vendor,
      },
      platform.toLowerCase()
    ).then(() => {
      setOfferDetail({ ...offerDetail, status: 'Cancelled' });
      setofferDetailMaster({
        ...offerDetailMaster,
        master_offer: { offer_status: 'Cancelled' },
      });
      setIsOpen(false);
      client.invalidateQueries(['planning', 'offersv3']);
    });
  };

  useQuery(
    ['getPlanningOfferDetails', { master_offer_id, vendorsObj }],
    () => {
      if (JSON.stringify(vendorsObj) === JSON.stringify({})) return null;

      return (
        getPlanningOfferDetails({
          master_email: user.email,
          access_token: user?.access_token || '',
          vendors: vendorsObj,
          platform: platform.toLowerCase(),
          master_offer_id,
        })
          .then((res) => {
            setofferDetailMaster(res.data);
            return res;
          })
          //     // eslint-disable-next-line no-console
          .catch((err) => {
            console.error({ err });
            return err;
          })
      );
    },
    { enabled: !!vendorsObj }
  );

  const getMenuTypeOffer = () => {
    if (type_offer !== 'Menu discount') {
      return 'Offer on an item from the menu';
    }
    return 'Offer on the whole menu';
  };
  return (
    <>
      <CancelOfferModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        cancelOffer={handleCancelOfferMaster}
        platform={platform}
      />
      <div className='wrapper marketing-wrapper'>
        <PaperKit className='marketing-paper offer-paper'>
          <div>
            <div className='offer-details-actions'>
              <button onClick={() => setOpened(false)} type='button' className='back-icon'>
                <Arrow />
                <span style={{ paddingLeft: '5px' }}>Back</span>
              </button>
              <div>
                {['Live', 'Active', 'Scheduled'].includes(
                  offerDetailMaster?.master_offer?.offer_status ||
                    offerDetailMaster?.master_offer?.status
                ) && (
                  <button onClick={openCancelModal} className='cancel-btn' type='button'>
                    <Warning />
                    <span style={{ color: '#FF4842' }}>Cancel Offer</span>
                  </button>
                )}
              </div>
            </div>
            <div className='offer-infos'>
              <div className='restau'>
                <Calendar />
                <div className='restau-infos'>
                  <div className='restau-name'>
                    {getChainData(chain_id, vendor_ids)?.chain_name || (
                      <SkeletonKit width={70} height={30} />
                    )}
                  </div>
                </div>
              </div>
              <div className='offer'>
                {renderOfferStatus(offerDetailMaster?.master_offer?.status)}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className='offer-title'>Offer Date :</span>
                  <span className='offer-sub-title'>
                    {start_date || <SkeletonKit width={60} height={30} />}
                  </span>
                </div>
                {renderPlatform(platform)}
              </div>
            </div>
            {status !== 'Scheduled' && (
              <div className='offer-visibility-container-scroll'>
                <div className='offer-visibility-container'>
                  <div className='offer-visibility-block'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className='offer-visibility-title with-icon'>Caroussel Visibility</span>
                      <Arrow />
                    </div>
                    <div className='offer-visibility-sub-title'>Caroussel</div>
                  </div>
                  {/* <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>Visibility Rank</span>
                    </div>
                    <div className='offer-visibility-sub-title'>
                      {accrued_discount === 0 || accrued_discount ? accrued_discount : '-'}
                    </div>
                  </div> */}
                  <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>#Orders</span>
                    </div>
                    <div className='offer-visibility-sub-title'>
                      {n_orders === 0 || n_orders ? n_orders : '-'}
                    </div>
                  </div>
                  <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>Avg Basket</span>
                    </div>
                    <div className='offer-visibility-sub-title'>
                      {average_basket === 0 || average_basket ? average_basket : '-'}
                    </div>
                  </div>
                  <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>Roi</span>
                    </div>
                    <div className='offer-visibility-sub-title'>{roi === 0 || roi ? roi : '-'}</div>
                  </div>
                  <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>Revenue</span>
                    </div>
                    <div className='offer-visibility-sub-title'>
                      {revenue === 0 || revenue ? revenue : '-'}
                    </div>
                  </div>
                  <div className='offer-visibility-block'>
                    <div>
                      <span className='offer-visibility-title'>Profits</span>
                    </div>
                    <div className='offer-visibility-sub-title'>
                      {profit === 0 || profit ? profit : '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {master_offer_id && (
              <div>
                <div className='offer-duration-container'>
                  <div className='offer-duration-block'>
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
                      <span className='offer-duration width-left-icon width-right-icon'>
                        Program the offer duration
                      </span>
                      {scheduleTypeMapping[(type_schedule || '').toLowerCase()] || type_schedule ? (
                        <ExpandIcon />
                      ) : (
                        ''
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className='offer-duration  width-right-icon'>
                        {scheduleTypeMapping[(type_schedule || '').toLowerCase()] ||
                          type_schedule ||
                          ''}
                      </span>
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
                        {start_date || <SkeletonKit />}
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
                        {end_date || <SkeletonKit />}
                      </div>
                    </div>
                  </div>
                </div>

                {Object.keys(offerDetailMaster?.children_offers || {}).length === 0 &&
                Object.keys(offerDetailMaster?.master_offer || {}).length === 0 ? (
                  <div className='offerdetails_time_slots' style={{ width: '100%' }}>
                    <SpinnerKit />
                  </div>
                ) : (
                  <div className='offerdetails_time_slots_scroll'>
                    {Object.keys(offerDetailMaster.children_offers).length === 0 ? (
                      ''
                    ) : (
                      <div style={{ width: 'fit-content' }} className='offerdetails_time_slots'>
                        {Object.keys(offerDetailMaster?.children_offers || {}).map((id) => (
                          <TimeSlot key={id} data={offerDetailMaster.children_offers[id]} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className='offer-duration-container'>
              <div className='offer-duration-block'>
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
                  <span className='offer-duration width-left-icon width-right-icon'>
                    {type_offer ? getMenuTypeOffer() : <SkeletonKit width={130} height={30} />}
                  </span>
                  {type_offer && type_offer !== 'Menu discount' ? <ExpandIcon /> : ''}
                </div>
                {type_offer && type_offer !== 'Menu discount' && (
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
                      {type_offer}
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
                    {discount_rate || discount_rate === 0 ? `${discount_rate}%` : <SkeletonKit />}
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
                    {minimum_order_value || minimum_order_value === 0 ? (
                      `${minimum_order_value} AED`
                    ) : (
                      <SkeletonKit />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {type_offer &&
              type_offer !== 'Menu discount' &&
              [
                { drn_id: 'e8cee7b9-f191-4392-8f53-8d019ee02c41' },
                { drn_id: '5a9e1ab0-69a2-48b8-bed3-2858b5b9aa1d' },
              ].map((menuItem) => (
                <MenuItem
                  key={menuItem.drn_id}
                  drnId={menuItem.drn_id}
                  discountRate={discount_rate}
                  platform={platform}
                  vendorId={vendor_ids}
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
const TimeSlot = ({ data }) => (
  <div
    style={{
      display: 'flex',
      marginLeft: '30px',
      width: '150px',
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
          {new Date(data.start_date).toLocaleDateString() ===
          new Date(data.end_date).toLocaleDateString()
            ? data.start_date
            : `${data.start_date} - ${data.end_date}`}
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
            {format(new Date(`01 Jan 1970 ${data.start_hour || '00:00'}:00`), 'H:mm aaa')}
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
            {format(new Date(`01 Jan 1970 ${data.end_hour || '00:00'}:00`), 'H:mm aaa')}
          </span>
        </div>
      </div>
    </div>
  </div>
);
