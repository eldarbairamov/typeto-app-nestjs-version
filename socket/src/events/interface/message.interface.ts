import { IUser } from "./user.interface";

export interface IMessage {
   id: number;
   content: string;
   senderId: number;
   conversationId: number;
   lastModified: string;
   sender: IUser;
}