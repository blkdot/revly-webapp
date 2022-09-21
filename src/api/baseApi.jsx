import { AxiosError } from 'axios';

export const handleResponse = (res) => {
  if (res.status > 399 || res instanceof Error || res instanceof AxiosError) {
    if (!res.response.data.detail) return res;

    if (typeof res.response.data.detail === 'string') {
      return new Error(res.response.data.detail);
    }

    return res;
  }

  if (!res.data) return new Error('No response');

  if (res.data.status_code && res.data.status_code > 399) return new Error(res.data.detail);

  return res.data;
};

export default handleResponse;
