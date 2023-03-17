import { useQuery } from '@tanstack/react-query';
import { api, handleResponse, fetcher, type ApiError } from './utils';

export const settingsOnboardPlatform = (body, platform) =>
  api.post(`/settingsv2/onboard/${platform}`, body).then(handleResponse).catch(handleResponse);

export const settingsOnboardPlatformStatus = (body, platform) =>
  api
    .put(`/settingsv2/onboard/${platform}/status`, body)
    .then(handleResponse)
    .catch(handleResponse);

export const settingsOnboarded = (body) =>
  api.post(`/settingsv2/onboarded`, body).then(handleResponse).catch(handleResponse);

export const settingsLogin = (body) =>
  api.post(`/settingsv2/login`, body).then(handleResponse).catch(handleResponse);

export const settingsSave = (body) =>
  api.post(`/settingsv2/savev2`, body).then(handleResponse).catch(handleResponse);

export const settingsLoad = (body) =>
  api.post(`/settingsv2/loadv2`, body).then(handleResponse).catch(handleResponse);

export const useSettingsOnboarded = (body: Record<string, unknown>, key?: any) =>
  useQuery<unknown, ApiError, any>(
    ['userSettings', key],
    () => fetcher(`/settingsv2/onboarded`, body),
    { retry: false }
  );

export const settingsOnboard = (body) =>
  api.post(`/settingsv2/onboard`, body).then(handleResponse).catch(handleResponse);
