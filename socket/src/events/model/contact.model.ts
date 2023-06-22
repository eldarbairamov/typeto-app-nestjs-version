import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table( { tableName: "contacts", timestamps: false } )
export class ContactModel extends Model {

   @ForeignKey( () => UserModel )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly contactId: number;

   @ForeignKey( () => UserModel )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly userId: number;

}