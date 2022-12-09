import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getOffers = (body) =>
  axios.post(`${apiUrl}/planning/offersv2`, body).catch(handleResponse);

export const getAds = (body) => axios.post(`${apiUrl}/planning/ads`, body).catch(handleResponse);
