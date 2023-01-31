import axios from 'axios';
import config from '../setup/config';
import { handleResponse } from './baseApi';

const { apiUrl } = config;

export const getOffers = (body) =>
  axios.post(`${apiUrl}/planning/offersv2`, body).catch(handleResponse);

export const getAds = (body) => axios.post(`${apiUrl}/planning/adsv2`, body).catch(handleResponse);
