import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getAlerts = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/alertv2/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getCompetitors = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/competitors/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const getRanking = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/ranking/${platform}`, body)
    .then((res) => res)
    .catch(handleResponse);

export const sendMail = (data) =>
  axios
    .post(
      `https://us-central1-test-909d1.cloudfunctions.net/sendMail?emailTo=${data.emailTo}&userRestaurant=${data.userRestaurant}&name=${data.name}&platform=${data.platform}&country=${data.country}&city=${data.city}&areaName=${data.areaName}&cuisine=${data.cuisine}`,
    )
    .then((res) => res)
    .catch(handleResponse);
