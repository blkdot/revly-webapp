import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import useApi from '../../../hooks/useApi';
import defaultImage from '../../../assets/images/default.png';
import config from '../../../setup/config';
import { useUserAuth } from '../../../contexts/AuthContext';
import useDate from '../../../hooks/useDate';

const MenuItem = ({ itemId, discountRate, platform, vendorId }) => {
  const [data, setData] = useState(null);
  const { getOfferDetails } = useApi();
  const { environment } = config;
  const { user } = useUserAuth();
  const { vendorsContext } = useDate();
  const vendor = vendorsContext[platform]?.find((v) => v.vendor_id === `${vendorId}`);

  const getOfferDetailData = () => {
    getOfferDetails(
      {
        master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
        access_token: '',
        vendor,
        id: itemId,
      },
      platform,
    )
      .then((res) => setData(res.data))
      // eslint-disable-next-line no-console
      .catch((err) => console.log({ err }));
  };
  // triggerAlertWithMessageError('Error while retrieving data'+ )
  useEffect(() => getOfferDetailData(), [itemId]);

  if (!data || !data.item) return null;
  const {
    item: { category, name, price, url },
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
      }}
    >
      <div style={{ display: 'flex' }}>
        <Checkbox classes={{ colorSecondary: '#906BFF' }} checked />
        <img
          style={{ borderRadius: '10px' }}
          width={40}
          hieght={40}
          src={url || defaultImage}
          alt="item"
        />
        <div
          style={{
            marginLeft: '23px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
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
            }}
          >
            {category}
          </span>
        </div>
      </div>
      <div className="price">
        <span style={{ marginRight: '12px' }}>{`${price} AED`}</span>
        <span>{`${price * (discountRate / 100)} AED`}</span>
      </div>
    </div>
  );
};
export default MenuItem;
