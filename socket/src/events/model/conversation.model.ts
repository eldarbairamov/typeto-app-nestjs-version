import { BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { ConversationUserModel } from "./conversation-user.model";
import { MessageModel } from "./message.model";
import { UserModel } from "./user.model";

export interface ConversationAttr {
   id: number;
   conversationName: string;
   isGroupConversation: boolean;
   adminId: number;
   lastModified: number;
   lastMessage: MessageModel;
   users: UserModel[];
   messages: MessageModel[];
}

interface ConversationCreationAttr {
   conversationName?: string;
   isGroupConversation?: boolean;
   lastMessage?: MessageModel;
   adminId?: number;
}

@Table( { tableName: "conversations", timestamps: false } )
export class ConversationModel extends Model<ConversationAttr, ConversationCreationAttr> {

   @Column( { type: DataType.STRING, allowNull: true } )
   conversationName: string;

   @Column( { type: DataType.BOOLEAN, allowNull: true, defaultValue: false } )
   isGroupConversation: boolean;

   @Column( { type: DataType.INTEGER, allowNull: true, defaultValue: null } )
   adminId: number;

   @Column( { type: DataType.BIGINT, allowNull: true } )
   lastModified: number;

   @BelongsToMany( () => UserModel, () => ConversationUserModel, "conversationId" )
   users: UserModel[];

   @BelongsTo( () => UserModel, "adminId" )
   admin: UserModel;

   @HasOne( () => MessageModel, "conversationId" )
   lastMessage: MessageModel;

   @HasMany( () => MessageModel, { foreignKey: "conversationId" } )
   messages: MessageModel[];

}