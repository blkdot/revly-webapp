import axios from 'axios';
import config from 'setup/config';
import { handleResponse } from './baseApi';

const { apiUrl } = config;

export const getElligibilityDeliveroo = (body) =>
  axios
    .post(`${apiUrl}/marketingv2/eligibility/deliveroo`, body)
    .then((res) => res)
    .catch(handleResponse);
    