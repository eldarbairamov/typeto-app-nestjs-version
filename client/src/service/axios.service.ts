import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import { authApi, storageApi } from "../api";
import { AuthorizedRouter, UnauthorizedRoutesEnum } from "../router";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
   headers: AxiosRequestHeaders;
}

export type AxiosApiError = AxiosError<{ message: string, status: number }>

export const axiosInstance = axios.create( { baseURL: "http://localhost:3100" } );

axiosInstance.interceptors.request.use( ( config: AdaptAxiosRequestConfig ) => {
   const accessToken = storageApi.getAccessToken();

   if ( accessToken ) config.headers.setAuthorization( `Bearer ${ accessToken }` );

   return config;
} );

axiosInstance.interceptors.response.use( ( config ) => {
       return config;
    },
    async ( e ) => {
       const axiosError = e as AxiosApiError;
       const refreshToken = storageApi.getRefreshToken();
       const originalRequest = e.config as InternalAxiosRequestConfig<any> & { _isRetry: boolean };

       if ( axiosError.response?.status === 401 && refreshToken && !originalRequest._isRetry ) {
          originalRequest._isRetry = true;

          try {
             console.log( "try" );
             const { data } = await authApi.refresh( refreshToken );
             storageApi.setTokens( data );
          }
          catch ( e ) {
             storageApi.deleteTokens();
             AuthorizedRouter.navigate( UnauthorizedRoutesEnum.UnauthorizedPage );
          }

          return axiosInstance( originalRequest );
       }

       if ( axiosError.response?.status === 401 && axiosError.response?.data.message === "Token invalid or expired" ) {
          storageApi.deleteTokens();
          AuthorizedRouter.navigate( UnauthorizedRoutesEnum.UnauthorizedPage );
       }

       return Promise.reject( e );
    } );