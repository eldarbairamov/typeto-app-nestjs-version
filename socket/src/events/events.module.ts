import { ConversationModel, ConversationUserModel, MessageModel, UserModel } from "./model";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventsGateway } from "./events.gateway";
import { GetConversationService, SessionManagerService } from "./service";
import { EventsService } from "./events.service";

@Module( {
   imports: [ SequelizeModule.forFeature( [ ConversationModel, UserModel, MessageModel, ConversationUserModel ] ) ],
   providers: [ EventsGateway, SessionManagerService, EventsService, GetConversationService ]
} )
export class EventsModule {
}