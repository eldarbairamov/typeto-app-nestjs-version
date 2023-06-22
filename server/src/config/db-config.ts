import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { ContactModel, UserModel } from "../user/model";
import { MessageModel } from "../message/model/message.model";
import { ConversationModel, ConversationUserModel } from "../conversation/model";
import { ActionTokenModel, OAuthModel } from "../auth/model";
import configuration from "../config";

export const dbConfig: SequelizeModuleOptions = {
   dialect: "postgres",
   host: configuration().POSTGRES_HOST,
   port: Number( configuration().POSTGRES_PORT ),
   username: configuration().POSTGRES_USER,
   password: configuration().POSTGRES_PASSWORD,
   database: configuration().POSTGRES_DB,
   autoLoadModels: true,
   logging: false,
   models: [
      UserModel,
      MessageModel,
      ConversationModel,
      OAuthModel,
      ActionTokenModel,
      ConversationUserModel,
      ContactModel
   ],
};