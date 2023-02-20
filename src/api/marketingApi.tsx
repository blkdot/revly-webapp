import axios from 'axios';
import config from '../setup/config';
import { handleResponse } from './baseApi';

const { apiUrl } = config;

export const getOffers = (body) =>
  axios
    .post(`${apiUrl}/planning/offers`, body)
    .then((res) => res)
    .catch(handleResponse);

export const cancelOffer = (body, platform) =>
  axios
    .post(`${apiUrl}/marketingv2/cancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
export const cancelOfferMaster = (body, platform) =>
  axios
    .post(`${apiUrl}/marketingv2/mastercancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
export const triggerOffers = (platform, body) =>
  axios
    .post(`${apiUrl}/marketingv2/offer/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
// export const triggerOffers = (platform, body) => {
//   console.log(body);
//   return new Error;
// };

export const _ = () => null;
