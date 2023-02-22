import axios from 'axios';
import config from 'setup/config';
import { handleResponse } from './baseApi';

const { apiUrl, firebaseApiUrl } = config;

export const getAlerts = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/alertsv2/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getCompetitors = (body) =>
  axios
    .post(`${apiUrl}/competition/competitors`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getRanking = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/rankingv3/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getAreas = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/areas/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getCuisines = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/cuisines/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const sendMail = (data) =>
  axios
    .post(
      `${firebaseApiUrl}/sendMail?emailTo=${data.emailTo}&userRestaurant=${data.userRestaurant}&name=${data.name}&platform=${data.platform}&country=${data.country}&city=${data.city}&areaName=${data.areaName}&cuisine=${data.cuisine}`
    )
    .then((res) => res)
    .catch(handleResponse);
