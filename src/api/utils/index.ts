/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { config } from 'config';
import { auth } from 'firebase-config';

const { apiUrl } = config;

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  timeoutErrorMessage: 'Request Timeout',
});

api.interceptors.request.use((v) => {
  if (auth.currentUser && (auth.currentUser as any).accessToken) {
    v.headers.set('Authorization', `Bearer ${(auth.currentUser as any).accessToken}`);
  }

  return v;
});

export class ApiError extends Error {
  code: number;

  message: string;

  constructor(code: number, message: string) {
    super(message);

    this.message = message;
    this.code = code;
  }
}

type Options<T> = Omit<UseQueryOptions<T, ApiError, T, QueryKey>, 'queryKey' | 'queryFn'>;

const errorToApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;

    return new ApiError(err.response.status, err.response.statusText);
  }

  return new ApiError(500, 'Unknown Error');
};

export const fetcher = async <T>(url: string, payload: Record<string, unknown>): Promise<T> => {
  try {
    const response = await api.post<T>(url, payload);
    return response.data;
  } catch (error) {
    throw errorToApiError(error);
  }
};

export const handleResponse = (res) => {
  if (res.status > 399 || res instanceof Error || res instanceof AxiosError) {
    if (!res.response.data?.detail) return res;

    if (typeof res.response.data?.detail === 'string') {
      return new Error(res.response.data.detail);
    }

    return res;
  }

  if (!res.data) return new Error('No response');

  if (res.data.status_code && res.data.status_code > 399) return new Error(res.data.detail);

  return res.data;
};
