import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import config from "@/types/Config";
import { HttpHeaders, HttpMethod } from "@/types/Types";

const instance = axios.create({
  baseURL: config.apiUrl,
});

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const call = async <T>(
  method: HttpMethod,
  uri: string | (() => string),
  headers: HttpHeaders,
  body: object | undefined = undefined,
  shouldRefresh: boolean = true,
  baseUrl: string = config.apiUrl
): Promise<T> => {
  const url = typeof uri === "string" ? config.makeApiUrl(uri, baseUrl) : uri();

  const options: AxiosRequestConfig = {
    method,
    url,
    headers,
    data: body,
  };

  try {
    const response: AxiosResponse<T> = await instance(options);

    return response.data as T;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};

// updated all the helper functions to support multiple url

export function get<T>(
  uri: string,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.get, uri, headers, undefined, true, baseUrl);
}

export function post<T>(
  uri: string,
  body: object,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.post, uri, headers, body, true, baseUrl);
}

export function put<T>(
  uri: string,
  body: object,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.put, uri, headers, body, true, baseUrl);
}

export function patch<T>(
  uri: string,
  body: object,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.patch, uri, headers, body, true, baseUrl);
}

export function del<T>(
  uri: string,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.del, uri, headers, undefined, true, baseUrl);
}


export function delMany<T>(
  uri: string,
  body: object,
  headers: HttpHeaders = {},
  baseUrl: string = config.apiUrl
): Promise<T> {
  return call(HttpMethod.del, uri, headers, body, true, baseUrl);
}

