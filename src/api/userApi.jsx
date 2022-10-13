import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getMetrics = (body) =>
  axios
    .post(`${apiUrl}/user/metrics`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const getVendors = (body) =>
  axios
    .post(`${apiUrl}/user/vendors`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const getHeatmap = (type, body) =>
  axios
    .post(`${apiUrl}/user/heatmap/${type}`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then(handleResponse)
    .catch(handleResponse);

export const getMenu = (body, platform) =>
  axios
    .post(`${apiUrl}/user/menu/${platform}`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const getOfferDetails = (body, platform) =>
  axios
    .post(`${apiUrl}/user/item/${platform}`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;
