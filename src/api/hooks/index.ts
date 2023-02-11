/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import config from 'setup/config';

const { apiUrl } = config;

const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  timeoutErrorMessage: 'Request Timeout',
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

export const useOffers = <T>(
  payload: Record<string, unknown>,
  options?: Options<T>
): UseQueryResult<T, ApiError> =>
  useQuery<T, ApiError, T>(
    ['planning', 'offers', 'v3'],
    () => fetcher('/planning/offersv3', payload),
    options
  );

export const useAds = <T>(
  payload: Record<string, unknown>,
  options?: Options<T>
): UseQueryResult<T, ApiError> =>
  useQuery<T, ApiError, T>(
    ['planning', 'ads', 'v3'],
    () => fetcher('/planning/adsv3', payload),
    options
  );

export const useRevenueHeatmap = (
  payload: Record<string, unknown>,
  options?: Options<unknown>
): UseQueryResult<unknown, ApiError> =>
  useQuery<unknown, ApiError, unknown>(
    ['user', 'heatmapv2', 'revenue'],
    () => fetcher('/user/heatmapv2/revenue', payload),
    options
  );

export const useOrdersHeatmap = (
  payload: Record<string, unknown>,
  options?: Options<unknown>
): UseQueryResult<unknown, ApiError> =>
  useQuery<unknown, ApiError, unknown>(
    ['user', 'heatmapv2', 'orders'],
    () => fetcher('/user/heatmapv2/orders', payload),
    options
  );
