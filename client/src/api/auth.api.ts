import { IAccessTokenPair, ILoginForm, IRegistrationForm } from "../interface";
import { axiosInstance } from "../service";
import { AxiosResponse } from "axios";

export const authApi = {

   registration: async ( data: IRegistrationForm ): Promise<void> => {
      await axiosInstance.post( "/auth/registration", data );
   },

   login: async ( body: ILoginForm ): Promise<AxiosResponse<IAccessTokenPair>> => {
      return await axiosInstance.post<IAccessTokenPair>( "/auth/login", body );
   },

   logout: async (): Promise<void> => {
      await axiosInstance.delete( "/auth/logout" );
   },

   forgotPassword: async ( email: string ): Promise<void> => {
      await axiosInstance.post( "/auth/forgot_password", { email } );
   },

   resetPassword: async ( resetPasswordToken: string, password: string ): Promise<void> => {
      await axiosInstance.patch( "/auth/reset_password", { resetPasswordToken, password } );
   },

   refresh: async ( refreshToken: string ): Promise<AxiosResponse<IAccessTokenPair>> => {
      return await axiosInstance.post<IAccessTokenPair>( "/auth/refresh", { refreshToken } );
   }

};