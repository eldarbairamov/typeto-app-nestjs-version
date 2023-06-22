import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConversationModel, ConversationUserModel } from "./model";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { ConfigService } from "@nestjs/config";
import { UserModel } from "../user/model";

@Module( {
   imports: [ SequelizeModule.forFeature( [ ConversationModel, ConversationUserModel, UserModel ] ) ],
   controllers: [ ConversationController ],
   providers: [ ConversationService, ConfigService ]
} )
export class ConversationModule {
}