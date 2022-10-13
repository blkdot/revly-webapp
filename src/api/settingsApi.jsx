import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';
import { fakeSettingsOnboardPlatform } from '../data/fakeDataOnboarding';

const { apiUrl, environment } = config;

export const settingsOnboardPlatform = (body, platform) => {
  if (environment !== 'dev') {
    return axios
      .post(`${apiUrl}/settings/onboard/${platform}`, {
        ...body,
        master_email: 'chiekh.alloul@gmail.com',
      })
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
      .put(`${apiUrl}/settings/onboard/${platform}/status`, {
        ...body,
        master_email: 'chiekh.alloul@gmail.com',
      })
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
        active: body.active_status,
      },
    },
  };

  localStorage.setItem('fakeOnboarding', JSON.stringify(newFakeOnboarding));

  return {
    ...fakeOnboarding.platforms[platform],
    active: body.active_status,
  };
};

export const settingsOnboarded = (body) => {
  if (environment !== 'dev') {
    return axios
      .post(`${apiUrl}/settings/onboarded`, {
        ...body,
        master_email: 'chiekh.alloul@gmail.com',
      })
      .then(handleResponse)
      .catch(handleResponse);
  }

  const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

  if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

  return JSON.parse(stringFakeOnboarding);
};

export const settingsLogin = (body) => {
  if (environment !== 'dev') {
    return axios
      .post(`${apiUrl}/settings/login`, {
        ...body,
        master_email: 'chiekh.alloul@gmail.com',
      })
      .then(handleResponse)
      .catch(handleResponse);
  }

  const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

  if (!stringFakeOnboarding) return fakeSettingsOnboardPlatform;

  return JSON.parse(stringFakeOnboarding);
};

export const settingsSave = (body) =>
  axios
    .post(`${apiUrl}/settings/save`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then(handleResponse)
    .catch(handleResponse);

export const settingsLoad = (body) =>
  axios
    .post(`${apiUrl}/settings/load`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then(handleResponse)
    .catch(handleResponse);
