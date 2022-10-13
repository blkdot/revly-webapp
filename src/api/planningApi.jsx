import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getOffers = (body) =>
  axios
    .post(`${apiUrl}/planning/offers`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const getAds = (body) =>
  axios
    .post(`${apiUrl}/planning/ads`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;

/* export const getOffers = (body) => {
  console.log({ body });
  return new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(
      () =>
        resolve({
          data: {
            offers: [
              {
                offer_id: 2765490,
                master_id: null,
                vendor_name: "Adam's Kitchen",
                vendor_id: 126601,
                platform: 'deliveroo',
                start_date: '24/09 at 09:00',
                end_date: '24/09 at 10:59',
                type_schedule: null,
                menu_items: null,
                discount_type: 'Menu discount',
                discount_rate: 25,
                minimum_order_value: 20.0,
                target: 'New customers only',
                status: 'Active',
                data: null,
              },
            ],
            total_n_offers: 49,
          },
        }),
      2000,
    ),
  );
}; */
