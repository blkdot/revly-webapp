import config from 'setup/config';
import { api, handleResponse } from './utils';

const { firebaseApiUrl } = config;

export const getAlerts = (body, platform) =>
  api
    .post(`/competition/alertsv2/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getCompetitors = (body) =>
  api
    .post(`/competition/competitors`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getRanking = (body, platform) =>
  api
    .post(`/competition/rankingv3/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getAreas = (body, platform) =>
  api
    .post(`/competition/areas/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getCuisines = (body, platform) =>
  api
    .post(`/competition/cuisines/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const sendMail = (data) =>
  api
    .post(
      `${firebaseApiUrl}/sendMail?emailTo=${data.emailTo}&userRestaurant=${data.userRestaurant}&name=${data.name}&platform=${data.platform}&country=${data.country}&city=${data.city}&areaName=${data.areaName}&cuisine=${data.cuisine}`
    )
    .then((res) => res)
    .catch(handleResponse);
