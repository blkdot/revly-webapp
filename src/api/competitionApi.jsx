import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getAlerts = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/alert/${platform}`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);

export const getCompetitors = (body, platform) =>
  axios
    .post(`${apiUrl}/competition/competitors/${platform}`, {
      ...body,
      master_email: 'chiekh.alloul@gmail.com',
    })
    .then((res) => res)
    .catch(handleResponse);
