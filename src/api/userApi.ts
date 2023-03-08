import { config } from 'config';
import { api, handleResponse } from './utils';

const { firebaseApiUrl } = config;

export const getMetrics = (body) =>
  api
    .post(`/user/metricsv2`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getVendors = (body) => api.post(`/user/vendorsv2`, body).then(handleResponse);

export const getHeatmap = (type, body) =>
  api.post(`/user/heatmapv2/${type}`, body).then(handleResponse).catch(handleResponse);

export const getMenu = (body, platform) =>
  api
    .post(`/user/menuv2/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getOfferDetails = (body, platform) =>
  api
    .post(`/user/item/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getPlanningOfferDetails = (body) =>
  api
    .post(`/planning/offerdetailsv2`, body)
    .then((res) => res)
    .catch(handleResponse);

export const forgotPassword = (email) =>
  api
    .post(`${firebaseApiUrl}/forgotPassword?email=${email}`)
    .then((res) => res)
    .catch(handleResponse);

export const verifyEmail = (user) =>
  api
    .post(
      `${firebaseApiUrl}/verifyEmail?email=${user.email}&fname=${user.fname}&lname=${user.lname}`
    )
    .then((res) => res)
    .catch(handleResponse);

export const verifyEmailSample = (email) =>
  api
    .post(
      `${firebaseApiUrl}/verifyEmail?email=${email}`
    )
    .then((res) => res)
    .catch(handleResponse);

export const saveUser = (body) =>
  api
    .post(`/user/savev2`, body)
    .then((res) => res)
    .catch(handleResponse);
export const loadUser = (body) =>
  api
    .post(`/user/loadv2`, body)
    .then((res) => res)
    .catch(handleResponse);
