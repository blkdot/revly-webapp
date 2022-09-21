import axios from 'axios';

import { handleResponse } from './baseApi';

import config from '../setup/config';

const { apiUrl } = config;

export const getMetrics = (body) =>
  axios
    .post(`${apiUrl}/user/metrics`, body)
    .then((res) => res)
    .catch(handleResponse);

export const _ = () => null;
