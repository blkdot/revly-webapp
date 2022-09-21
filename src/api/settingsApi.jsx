import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';
import { fakeSettingsOnboardPlatform } from '../data/fakeDataOnboarding';

const { apiUrl, environment } = config;

export const settingsOnboardPlatform = (body, platform) => {
  if (environment !== 'dev') {
    return axios
      .post(`${apiUrl}/settings/onboard/${platform}`, body)
      .then(handleResponse)
      .catch(handleResponse);
  }

  if (body.credentials.email === 'test') {
    return fakeSettingsOnboardPlatform;
  }

  return new Error("Fake response: try with 'test' in the 'email' field ");
};

export const settingsOnboardPlatformStatus = (body, platform) => {
  if (environment !== 'dev') {
    return axios
      .put(`${apiUrl}/settings/onboard/${platform}/status`, body)
      .then(handleResponse)
      .catch(handleResponse);
  }

  const fakeOnboarding = JSON.parse(localStorage.getItem('fakeOnboarding'));

  const newFakeOnboarding = {
    ...fakeOnboarding,
    platforms: {
      ...fakeOnboarding.platforms,
      [platform]: {
        ...fakeOnboarding.platforms[platform],
        active_status: body.active_status,
      },
    },
  };

  localStorage.setItem('fakeOnboarding', JSON.stringify(newFakeOnboarding));

  return {
    ...fakeOnboarding.platforms[platform],
    active_status: body.active_status,
  };
};

export const settingsOnboarded = (body) => {
  if (environment !== 'dev') {
    return axios
      .post(`${apiUrl}/settings/onboarded`, body)
      .then(handleResponse)
      .catch(handleResponse);
  }

  const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

  if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

  return JSON.parse(stringFakeOnboarding);
};

export const settingsLogin = (body) => {
  if (environment !== 'dev') {
    return axios.post(`${apiUrl}/settings/login`, body).then(handleResponse).catch(handleResponse);
  }

  const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

  if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

  return JSON.parse(stringFakeOnboarding);
};

export const getMetrics = (body) =>
  axios
    .post(`${apiUrl}/user/metrics`, body)
    .then((res) => res)
    .catch(handleResponse);

export const settingsSave = (body) =>
  axios.post(`${apiUrl}/settings/save`, body).then(handleResponse).catch(handleResponse);
