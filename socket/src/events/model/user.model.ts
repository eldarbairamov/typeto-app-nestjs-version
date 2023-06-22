import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { ContactModel } from "./contact.model";
import { ConversationModel } from "./conversation.model";
import { ConversationUserModel } from "./conversation-user.model";

export interface UserAttr {
   id: number;
   username: string;
   email: string;
   password: string;
   image?: string | null;
   conversations: ConversationModel[];
}

interface UserCreationAttr {
   username: string;
   email: string;
   password: string;
   image?: string | null;
}

@Table( { modelName: "users", timestamps: false } )
export class UserModel extends Model<UserAttr, UserCreationAttr> {

   @Column( { type: DataType.STRING, allowNull: false } )
   username: string;

   @Column( { type: DataType.STRING, allowNull: false, unique: true } )
   email: string;

   @Column( { type: DataType.STRING, allowNull: false } )
   password: string;

   @Column( { type: DataType.STRING, allowNull: true } )
   image: string | null;

   @BelongsToMany( () => ConversationModel, () => ConversationUserModel, "userId" )
   conversations: ConversationModel[];

   @BelongsToMany( () => UserModel, () => ContactModel, "userId" )
   contacts: UserModel[];

}