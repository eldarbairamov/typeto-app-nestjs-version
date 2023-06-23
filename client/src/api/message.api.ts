import { axiosInstance } from "../service";
import { AxiosPromise } from "axios";
import { IMessage } from "../interface";

export const messageApi = {

   getMessages: async ( conversationId: number ): Promise<AxiosPromise<IMessage[]>> => {
      return await axiosInstance.get<IMessage[]>( `/messages/${ conversationId }` );
   },

   sendMessage: async ( conversationId: number, content: string ): Promise<AxiosPromise<IMessage>> => {
      return await axiosInstance.post<IMessage>( `/messages/${ conversationId }`, { content } );
   },

   sendImage: async ( formData: FormData, conversationId: number ): Promise<AxiosPromise<IMessage>> => {
      return await axiosInstance.post<IMessage>( `/messages/${ conversationId }/image`, formData );
   },

   deleteMessage: async ( messageId: number, conversationId: number ): Promise<AxiosPromise<IMessage>> => {
      return await axiosInstance.delete<IMessage>( `/messages/${ conversationId }`, {
         params: {
            messageId: messageId
         }
      } );
   },

};