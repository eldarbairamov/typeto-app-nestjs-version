import { IUser } from "./user.interface.ts";

export interface IMessage {
   id: number;
   content: string;
   senderId: number;
   conversationId: number;
   lastModified: number;
   sender: IUser;
   isImage: boolean;
   imageBlurHash: string;
}

export interface INewMessageReceived {
   conversationId: number,
}