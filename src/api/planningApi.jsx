import axios from 'axios';

import config from '../setup/config';

const { apiUrl } = config;

export const getOffers = (body) => axios.post(`${apiUrl}/planning/offersv2`, body);

export const getAds = (body) => axios.post(`${apiUrl}/planning/ads`, body);
