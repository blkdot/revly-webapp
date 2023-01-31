import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl, firebaseApiUrl } = config;

export const getMetrics = (body) =>
  axios
    .post(`${apiUrl}/user/metricsv2`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getVendors = (body) =>
  axios.post(`${apiUrl}/user/vendorsv2`, body).then(handleResponse);

export const getHeatmap = (type, body) =>
  axios.post(`${apiUrl}/user/heatmap/${type}`, body).then(handleResponse).catch(handleResponse);

export const getMenu = (body, platform) =>
  axios
    .post(`${apiUrl}/user/menuv2/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getOfferDetails = (body, platform) =>
  axios
    .post(`${apiUrl}/user/item/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getPlanningOfferDetails = (body) =>
  axios
    .post(`${apiUrl}/planning/offerdetails`, body)
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;

export const forgotPassword = (email) =>
  axios
    .post(`${firebaseApiUrl}/forgotPassword?email=${email}`)
    .then((res) => res)
    .catch(handleResponse);

export const verifyEmail = (user) =>
  axios
    .post(
      `${firebaseApiUrl}/verifyEmail?email=${user.email}&fname=${user.fname}&lname=${user.lname}`,
    )
    .then((res) => res)
    .catch(handleResponse);
