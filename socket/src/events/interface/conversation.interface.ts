import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";

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
}

export interface IUserFromConversation extends IUser {
   ConversationUser: {
      conversationId: number,
      userId: number
   };
}