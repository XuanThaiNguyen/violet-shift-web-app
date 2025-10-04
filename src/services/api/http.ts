/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { addToast } from "@heroui/react";

import type { Axios, AxiosDefaults, AxiosHeaderValue, AxiosRequestConfig, AxiosResponse, HeadersDefaults,  } from "axios"
import queryClient from "@/constants/queryClient";

interface HTTPInstance extends Axios {
    <T = any, R = AxiosResponse<T>, D = any>(
      config: AxiosRequestConfig<D>
    ): Promise<T>;
    <T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
  
    request<T = any, _R = AxiosResponse<T>, D = any>(
      config: AxiosRequestConfig<D>
    ): Promise<T>;
    get<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    delete<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    head<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    options<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    post<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    put<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    patch<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    postForm<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    putForm<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
    patchForm<T = any, _R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<T>;
  
    defaults: Omit<AxiosDefaults, "headers"> & {
      headers: HeadersDefaults & {
        [key: string]: AxiosHeaderValue;
      };
    };
  }

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as HTTPInstance;

const onResponse = <T = any>(res: AxiosResponse<T>): T => {
  const response = res.data as { status?: string; message?: string; data: T };
  return response.data;
};

api.interceptors.request.use((config) => {
  const token = globalThis?.localStorage?.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(onResponse, (error) => {
  if (error.response.status === 401 && error.request.url?.includes("/auth/login")) {
    localStorage.removeItem("auth_token");
    addToast({
      title: "Session expired",
      description: "Please login again, Redirecting to login page...",
      color: "danger",
      timeout: 2000,
      isClosing: true,
    });
    setTimeout(() => {
      window.history.pushState({}, "", "/auth/login");
      queryClient.invalidateQueries();
    }, 2000);
  }
  return Promise.reject(error);
});

export default api;
