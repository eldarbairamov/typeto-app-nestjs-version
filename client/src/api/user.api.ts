import { AxiosResponse } from "axios";
import { IUser, IUserBySearch } from "../interface";
import { axiosInstance } from "../service";

export const userApi = {

   findUser: async ( userEmail: string ): Promise<AxiosResponse<IUserBySearch>> => {
      return await axiosInstance.get<IUserBySearch>("/users", { params: { userEmail } });
   },

   addContact: async ( targetId: number ): Promise<void> => {
      await axiosInstance.post("/users/contacts", { targetId });
   },

   getContacts: async ( searchKey?: string ): Promise<AxiosResponse<IUser[]>> => {
      return await axiosInstance.get<IUser[]>(`users/contacts`, { params: { searchKey: searchKey ? searchKey : null } });
   },

   deleteContact: async ( contactId: number ): Promise<AxiosResponse<IUser[]>> => {
      return await axiosInstance.delete<IUser[]>("/users/contacts", { params: { contactId } });
   },

   uploadAvatar: async ( formData: FormData ): Promise<AxiosResponse<{ imageName: string }>> => {
      return await axiosInstance.patch<{ imageName: string }>("/users/avatar", formData);
   },

   deleteAvatar: async (): Promise<void> => {
      await axiosInstance.delete("/users/avatar");
   },

   getCurrentUser: async (): Promise<AxiosResponse<IUser>> => {
      return await axiosInstance.get<IUser>("/users/get_current_user");
   }

};