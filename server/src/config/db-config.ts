import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { ContactModel, UserModel } from "../user/model";
import { MessageModel } from "../message/model/message.model";
import { ConversationModel, ConversationUserModel } from "../conversation/model";
import { ActionTokenModel, OAuthModel } from "../auth/model";

export const dbConfig: SequelizeModuleOptions = {
   dialect: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "010596",
   database: "typeto_nestjs",
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
}