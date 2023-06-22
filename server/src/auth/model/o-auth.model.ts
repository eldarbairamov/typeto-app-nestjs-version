import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { UserModel } from "../../user/model";

interface OAuthAttr {
   id: number;
   ownerId: number;
   accessToken: string;
   refreshToken: string;
}

interface OAuthCreationAttr {
   ownerId: number;
   accessToken: string;
   refreshToken: string;
}

@Table( { tableName: "oAuths", timestamps: false } )
export class OAuthModel extends Model<OAuthAttr, OAuthCreationAttr> {

   @Column( { type: DataType.STRING, allowNull: false } )
   readonly accessToken: string;

   @Column( { type: DataType.INTEGER, allowNull: false } )
   readonly ownerId: number;

   @Column( { type: DataType.STRING, allowNull: false } )
   readonly refreshToken: string;

   @BelongsTo( () => UserModel, "ownerId" )
   readonly owner: UserModel;

}