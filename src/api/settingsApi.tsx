import axios from 'axios';
import config from '../setup/config';
import { handleResponse } from './baseApi';

const { apiUrl } = config;

export const settingsOnboardPlatform = (body, platform) =>
  axios
    .post(`${apiUrl}/settings/onboard/${platform}`, body)
    .then(handleResponse)
    .catch(handleResponse);

export const settingsOnboardPlatformStatus = (body, platform) =>
  axios
    .put(`${apiUrl}/settings/onboard/${platform}/status`, body)
    .then(handleResponse)
    .catch(handleResponse);

export const settingsOnboarded = (body) =>
  axios.post(`${apiUrl}/settings/onboarded`, body).then(handleResponse).catch(handleResponse);

export const settingsLogin = (body) =>
  axios.post(`${apiUrl}/settings/login`, body).then(handleResponse).catch(handleResponse);

export const settingsSave = (body) =>
  axios.post(`${apiUrl}/settings/save`, body).then(handleResponse).catch(handleResponse);

export const settingsLoad = (body) =>
  axios.post(`${apiUrl}/settings/load`, body).then(handleResponse).catch(handleResponse);
