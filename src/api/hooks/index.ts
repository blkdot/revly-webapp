/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useUser } from 'contexts';
import config from 'setup/config';
import { VendorsV2 } from 'types';

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

export const useVendorsV2 = (options?: Options<VendorsV2>): UseQueryResult<VendorsV2, ApiError> => {
  const user = useUser();

  return useQuery<unknown, ApiError, VendorsV2>(
    ['user', 'vendorsv2'],
    () =>
      fetcher<unknown>('/user/vendorsv2', {
        master_email: user.email,
        access_token: user.token,
      }),
    options
  );
};
