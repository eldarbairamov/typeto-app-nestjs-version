import { AxiosResponse } from "axios";
import { axiosInstance } from "../service";
import { IConversation, IConversationData } from "../interface";

export const conversationApi = {

   createConversation: async ( userIds: number[], conversationName?: string ): Promise<AxiosResponse<IConversation>> => {
      return await axiosInstance.post<IConversation>("/conversations", { userIds, conversationName });
   },

   getConversations: async ( limit: number, searchKey?: string, ): Promise<AxiosResponse<IConversationData>> => {
      return await axiosInstance.get<IConversationData>("/conversations", {
         params: {
            searchKey: searchKey ? searchKey : null,
            limit
         }
      });
   },

   kickUserFromGroupConversation: async ( conversationId: number, userId: number ): Promise<AxiosResponse<void>> => {
      return await axiosInstance.delete("/conversations/admin/kick", {
         params: {
            conversationId: conversationId,
            userId: userId
         }
      });
   },

   deleteConversation: async ( conversationId: number, limit: number ): Promise<AxiosResponse<IConversationData>> => {
      return await axiosInstance.delete<IConversationData>("/conversations", {
         params: {
            conversationId,
            limit,
         }
      });
   },

   deleteGroupConversation: async ( conversationId: number, limit: number ): Promise<AxiosResponse<IConversationData>> => {
      return await axiosInstance.delete<IConversationData>("/conversations/admin", {
         params: {
            conversationId,
            limit,
         }
      });
   },

   leaveGroupConversation: async ( conversationId: number, limit: number ): Promise<AxiosResponse<IConversationData>> => {
      return await axiosInstance.delete<IConversationData>("/conversations/leave", {
         params: {
            conversationId,
            limit,
         }
      });
   }

};