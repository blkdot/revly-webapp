import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getOffers = (body) =>
  axios
    .post(`${apiUrl}/planning/offers`, body)
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;
