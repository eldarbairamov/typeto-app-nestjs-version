import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { groupConversationPresenter, privateConversationPresenter } from "../presenter";
import { IConversation } from "../interface";
import { ConversationModel, MessageModel, UserModel } from "../model";

@Injectable()
export class GetConversationService {

   constructor( @InjectModel( ConversationModel ) private conversationModel: typeof ConversationModel ) {
   }

   async get( conversationId: number, senderId: number, whoWillReceive: "sender" | "receiver" ) {
      const receiverId = await this.conversationModel.findByPk( conversationId, {
         include:
             {
                model: UserModel,
                as: "users",
                attributes: [ "id", "username", "email", "image" ],
             }
      } )
          .then( conversation => conversation?.users.find( u => u.id !== senderId )?.id ) as number;

      return await this.conversationModel.findByPk( conversationId, {
         include: [
            {
               model: UserModel,
               as: "users",
               attributes: [ "id", "username", "email", "image" ],
               through: {
                  attributes: [ "isNewMessagesExist" ]
               },
            },
            {
               model: UserModel,
               as: "admin",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: MessageModel,
               as: "lastMessage",
            }
         ],
         order: [
            [ "lastModified", "DESC" ],
            [ { model: MessageModel, as: "lastMessage" }, "id", "ASC" ],
            [ { model: UserModel, as: "users" }, "id", "ASC" ]
         ]
      } )
          .then( conversation => {
             if ( conversation && conversation.isGroupConversation ) return groupConversationPresenter( conversation.toJSON(), whoWillReceive === "sender" ? senderId : receiverId );
             if ( conversation && !conversation.isGroupConversation ) return privateConversationPresenter( conversation.toJSON(), whoWillReceive === "sender" ? senderId : receiverId );

             return conversation;

          } ) as IConversation;
   }

}