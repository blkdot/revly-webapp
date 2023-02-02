import { Checkbox } from '@mui/material';
import { useUserAuth } from 'contexts';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import defaultImage from '../../../assets/images/default.png';
import useApi from '../../../hooks/useApi';
import { vendorsAtom } from '../../../store/vendorsAtom';

const MenuItem = ({ drnId, discountRate, platform, vendorId }) => {
  const [data, setData] = useState(null);
  const { getOfferDetails } = useApi();

  const { user } = useUserAuth();
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const vendor = vendorsObj[platform]?.find((v) => vendorId.include(v.vendor_id));

  const getOfferDetailData = () => {
    getOfferDetails(
      {
        master_email: user.email,
        access_token: '',
        vendors: vendor,
        drn_id: drnId,
      },
      platform
    )
      .then((res) => setData(res.data))
      // eslint-disable-next-line no-console
      .catch((err) => console.log({ err }));
  };

  useEffect(() => getOfferDetailData(), [drnId]);

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
          height={40}
          src={url || defaultImage}
          alt='item'
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
      <div className='price'>
        <span style={{ marginRight: '12px' }}>{`${price} AED`}</span>
        <span>{`${price * (discountRate / 100)} AED`}</span>
      </div>
    </div>
  );
};
export default MenuItem;
