import axios from 'axios';
import config from '../setup/config';
import { handleResponse } from './baseApi';

const { apiUrl } = config;

export const settingsOnboardPlatform = (body, platform) =>
  axios
    .post(`${apiUrl}/settingsv2/onboard/${platform}`, body)
    .then(handleResponse)
    .catch(handleResponse);

export const settingsOnboardPlatformStatus = (body, platform) =>
  axios
    .put(`${apiUrl}/settingsv2/onboard/${platform}/status`, body)
    .then(handleResponse)
    .catch(handleResponse);

export const settingsOnboarded = (body) =>
  axios.post(`${apiUrl}/settingsv2/onboarded`, body).then(handleResponse).catch(handleResponse);

export const settingsLogin = (body) =>
  axios.post(`${apiUrl}/settingsv2/login`, body).then(handleResponse).catch(handleResponse);

export const settingsSave = (body) =>
  axios.post(`${apiUrl}/settingsv2/savev2`, body).then(handleResponse).catch(handleResponse);

export const settingsLoad = (body) =>
  axios.post(`${apiUrl}/settingsv2/loadv2`, body).then(handleResponse).catch(handleResponse);
