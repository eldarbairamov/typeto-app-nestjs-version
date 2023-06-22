import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MessageModel } from "./model/message.model";
import { ConversationModel, ConversationUserModel } from "../conversation/model";
import { ImageService } from "../common/service/image.service";
import { UserModel } from "../user/model";

@Module( {
   imports: [ SequelizeModule.forFeature( [ MessageModel, ConversationModel, ConversationUserModel, UserModel ] ) ],
   controllers: [ MessageController ],
   providers: [ MessageService, ImageService ]
} )
export class MessageModule {
}