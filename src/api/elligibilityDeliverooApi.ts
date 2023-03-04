import { api, handleResponse } from './utils';

export const getElligibilityDeliveroo = (body) =>
  api
    .post(`/marketingv2/eligibility/deliveroo`, body)
    .then((res) => res)
    .catch(handleResponse);
