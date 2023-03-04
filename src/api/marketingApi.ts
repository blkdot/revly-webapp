import { api, handleResponse } from './utils';

export const getOffers = (body) =>
  api
    .post(`/planning/offers`, body)
    .then((res) => res)
    .catch(handleResponse);

export const cancelOffer = (body, platform) =>
  api
    .post(`/marketingv2/cancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const cancelOfferMaster = (body, platform) =>
  api
    .post(`/marketingv2/mastercancel/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const triggerOffers = (platform, body) =>
  api
    .post(`/marketingv2/offer/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);
