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
    .post(`${apiUrl}/marketing/cancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
export const cancelOfferMaster = (body, platform) =>
  axios
    .post(`${apiUrl}/marketing/mastercancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
export const triggerOffers = (platform, body) =>
  axios
    .post(`${apiUrl}/marketing/offer/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;
