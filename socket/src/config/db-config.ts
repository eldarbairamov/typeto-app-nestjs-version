import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { ContactModel, ConversationModel, ConversationUserModel, MessageModel, UserModel } from "../events/model";

export const dbConfig: SequelizeModuleOptions = {
   dialect: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "010596",
   database: "typeto_nestjs",
   autoLoadModels: true,
   logging: false,
   models: [ ContactModel, ConversationModel, ConversationUserModel, MessageModel, UserModel ],
}