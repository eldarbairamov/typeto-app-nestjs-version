import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { UserModel } from "./user.model";

interface ContactsAttr {
   readonly userId: number,
   readonly contactId: number
}

@Table( { tableName: "contacts", timestamps: false } )
export class ContactModel extends Model<ContactsAttr> {

   @ForeignKey( () => UserModel )
   @Column
   readonly contactId: number;

   @ForeignKey( () => UserModel )
   @Column
   readonly userId: number;

}