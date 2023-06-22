import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ConversationModel } from "./conversation.model";
import { UserModel } from "./user.model";

export interface ConversationUserAttr {
   readonly conversationId: number;
   readonly userId: number;
   readonly isNewMessagesExist: boolean;
}

interface ConversationUserCreationAttr {
   readonly conversationId: number;
   readonly userId: number;
   readonly isNewMessagesExist?: boolean;
}

@Table( { tableName: "conversationUser", timestamps: false } )
export class ConversationUserModel extends Model<ConversationUserAttr, ConversationUserCreationAttr> {

   @ForeignKey( () => ConversationModel )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly conversationId: number;

   @ForeignKey( () => UserModel )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly userId: number;

   @Column( { type: DataType.BOOLEAN, allowNull: true, defaultValue: false } )
   readonly isNewMessagesExist: boolean;

}