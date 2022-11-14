import axios from 'axios';

import config from '../setup/config';

const { apiUrl } = config;

export const getOffers = (body) => axios.post(`${apiUrl}/planning/offers`, body);

export const getAds = (body) => axios.post(`${apiUrl}/planning/ads`, body);
