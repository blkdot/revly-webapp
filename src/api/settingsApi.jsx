import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';
import { fakeSettingsOnboardPlatform } from '../data/fakeDataOnboarding';

const { apiUrl, environment } = config;

export const settingsOnboardPlatform = (body, platform) => {
  if (environment === 'dev') return fakeSettingsOnboardPlatform;

  return axios
    .post(`${apiUrl}/settings/onboard/${platform}`, body)
    .then(handleResponse)
    .catch(handleResponse);
};

export const settingsOnboarded = (param) => {
  if (environment === 'dev') {
    const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

    if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

    return JSON.parse(stringFakeOnboarding);
  }

  return axios
    .get(`${apiUrl}/settings/onboarded`, param)
    .then(handleResponse)
    .catch(handleResponse);
};

export const settingsLogin = (param) => {
  if (environment === 'dev') {
    const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

    if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

    return JSON.parse(stringFakeOnboarding);
  }

  return axios.get(`${apiUrl}/settings/login`, param).then(handleResponse).catch(handleResponse);
};
