import { IUserFromConversation } from "./user.interface.ts";
import { IMessage } from "./message.interface.ts";

export interface IConversation {
   id: number;
   conversationName: string;
   isGroupConversation: boolean;
   adminId: number;
   lastModified: number;
   conversationWith: IUserFromConversation[];
   users: IUserFromConversation[];
   lastMessage: IMessage;
   admin: IUserFromConversation;
   isNewMessagesExist: boolean;
}

export interface IActiveConversation extends IConversation {
   username?: string;
}

export interface IConversationData {
   data: IConversation[];
   count: number;
}