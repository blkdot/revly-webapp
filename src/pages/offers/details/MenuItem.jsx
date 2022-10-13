import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import useApi from '../../../hooks/useApi';
import burger from '../../../assets/images/burger.png';
// import config from '../../../setup/config';
// import { useUserAuth } from '../../../contexts/AuthContext';
// import useDate from '../../../hooks/useDate';

const MenuItem = ({ offerId, discountRate /* , platform */ }) => {
  const [data, setData] = useState(null);
  const { getOfferDetails } = useApi();
  // const { environment } = config;
  // const { user } = useUserAuth();
  // const { vendorsContext } = useDate();

  const getOfferDetailData = () => {
    getOfferDetails(
      {
        master_email: 'chiekh.alloul@gmail.com',
        access_token: '',
        vendor: {
          vendor_id: '126601',
          chain_id: '82369',
          data: {
            chain_name: "Fawzi Alghammary DMCC (Adam's Kitchen)",
            vendor_name: "Adam's Kitchen",
          },
          meta: {
            prefix_vendor_id: '',
          },
        },
        id: 391328231,
      },
      'deliveroo',
      /* {
        master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
        access_token: '',
        vendors: vendorsContext,
        id: offerId,
      },
      platform, */
    )
      .then((res) => setData(res.data))
      .catch((err) => console.log({ err }));
  };
  // triggerAlertWithMessageError('Error while retrieving data'+ )
  useEffect(() => getOfferDetailData(), [offerId]);

  if (!data) return null;
  const {
    item: { category, name, price },
  } = data;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        background: '#F9FAFB',
        borderRadius: '6px',
      }}>
      <div style={{ display: 'flex' }}>
        <Checkbox classes={{ colorSecondary: '#906BFF' }} checked />
        <img style={{ borderRadius: '10px' }} width={40} hieght={40} src={burger} alt="item" />
        <div
          style={{
            marginLeft: '23px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}>
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '22px',
              color: '#212B36',
            }}>
            {name}
          </span>
          <span
            style={{
              fontFamily: 'Public Sans',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '12px',
              lineHeight: '18px',
              color: '#637381',
            }}>
            {category}
          </span>
        </div>
      </div>
      <div className="price">
        <span>{`$${price}`}</span>
        <span>{`    $${price * (discountRate / 100)}`}</span>
      </div>
    </div>
  );
};
export default MenuItem;
