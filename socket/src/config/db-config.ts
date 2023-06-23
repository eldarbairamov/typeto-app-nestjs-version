import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { ContactModel, ConversationModel, ConversationUserModel, MessageModel, UserModel } from "../events/model";
import configuration from "../config";

export const dbConfig = (): SequelizeModuleOptions => ({
   dialect: "postgres",
   host: configuration().POSTGRES_HOST,
   port: Number( configuration().POSTGRES_PORT ),
   username: configuration().POSTGRES_USER,
   password: configuration().POSTGRES_PASSWORD,
   database: configuration().POSTGRES_DB,
   autoLoadModels: true,
   logging: false,
   models: [ ContactModel, ConversationModel, ConversationUserModel, MessageModel, UserModel ],
});