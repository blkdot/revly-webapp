import { AxiosError } from 'axios';

export const handleResponse = (res) => {
  if (res.data.status_code > 399) return new Error(res.data.detail);

  if (res.status > 399 || res instanceof Error || res instanceof AxiosError) {
    return formatInstanceError(res);
  }

  return res.response.data;
};

const formatInstanceError = (res) => {
  if (Array.isArray(res.response.data.detail)) {
    return new Error(res.response.data.detail[0].msg || res.message);
  }

  return new Error(res.response.data.detail || res.message);
};

export default handleResponse;
