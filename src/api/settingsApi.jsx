import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';
import { fakeSettingsOnboardPlatform } from '../data/fakeDataOnboarding';

const { apiUrl, environment } = config;

export const settingsOnboardPlatform = (body, platform) => {
  if (environment === 'dev') {
    if (body.credentials.email === 'test') {
      return fakeSettingsOnboardPlatform;
    }

    return new Error("Fake response: try with 'test' in the 'email' field ");
  }

  return axios
    .post(`${apiUrl}/settings/onboard/${platform}`, body)
    .then(handleResponse)
    .catch(handleResponse);
};

export const settingsOnboardPlatformStatus = (body, platform) => {
  if (environment === 'dev') {
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

    return newFakeOnboarding;
  }

  return axios
    .put(`${apiUrl}/settings/onboard/${platform}/status`, body)
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
