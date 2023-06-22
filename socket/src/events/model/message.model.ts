import { BeforeCreate, BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { UserModel } from "./user.model";
import { ConversationModel } from "./conversation.model";

interface MessageAttr {
   id: number;
   senderId: number;
   conversationId: number;
   content: string;
   lastModified: number;
   isImage: boolean;
   imageBlurHash?: string;
}

interface MessageCreationAttr {
   senderId: number;
   conversationId: number;
   content: string;
   isImage?: boolean;
   imageBlurHash?: string;
}

@Table( { modelName: "messages", timestamps: false } )
export class MessageModel extends Model<MessageAttr, MessageCreationAttr> {

   @Column( { type: DataType.TEXT, allowNull: false } )
   content: string;

   @Column( { type: DataType.INTEGER, allowNull: false } )
   senderId: number;

   @Column( { type: DataType.INTEGER, allowNull: false } )
   conversationId: number;

   @Column( { type: DataType.BIGINT, allowNull: true } )
   lastModified: number;

   @Column( { type: DataType.BOOLEAN, allowNull: true, defaultValue: false } )
   isImage: boolean;

   @BelongsTo( () => UserModel, "senderId" )
   sender: UserModel;

   @BelongsTo( () => ConversationModel, { foreignKey: "conversationId", onDelete: "CASCADE" } )
   conversation: ConversationModel;

   @BeforeCreate
   static async setMsDate( instance: MessageModel ) {
      instance.lastModified = new Date().getTime();
   }

}