import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { UserModel } from "../../user/model";

interface ActionTokenAttr {
   readonly id: number;
   readonly token: string;
   readonly tokenType: string;
   readonly ownerId: string;
   readonly owner: UserModel;
}

interface ActionTokenCreationAttr {
   readonly token: string;
   readonly tokenType: string;
   readonly ownerId: number;
}

@Table( { tableName: "actionTokens", timestamps: false } )
export class ActionTokenModel extends Model<ActionTokenAttr, ActionTokenCreationAttr> {

   @Column( { type: DataType.STRING, allowNull: false } )
   readonly token: string;

   @Column( { type: DataType.STRING, allowNull: false } )
   readonly tokenType: string;

   @Column( { type: DataType.INTEGER, allowNull: false } )
   readonly ownerId: number;

   @BelongsTo( () => UserModel, "ownerId" )
   readonly owner: UserModel;

}