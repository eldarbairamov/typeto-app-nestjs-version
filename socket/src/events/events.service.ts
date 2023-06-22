import { ConversationModel, ConversationUserModel, MessageModel, UserModel } from "./model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GetConversationService } from "./service";
import { conversationPresenter } from "./presenter";
import { IConversation, IMessage } from "./interface";
import { Op } from "sequelize";

@Injectable()
export class EventsService {
   constructor(
       @InjectModel( ConversationModel ) private conversationModel: typeof ConversationModel,
       @InjectModel( ConversationUserModel ) private conversationUserModel: typeof ConversationUserModel,
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       @InjectModel( MessageModel ) private messageModel: typeof MessageModel,
       private getConversationService: GetConversationService
   ) {
   }

   async createConversation( conversationId: number, whoCreatedId: number ) {
      return await this.conversationModel.findByPk( conversationId, {
         include: {
            model: UserModel,
            as: "users",
            attributes: [ "id", "username", "email", "image" ],
         },
         order: [
            [ { model: UserModel, as: "users" }, "id", "ASC" ]
         ]
      } )
          .then( conversation => {

             if ( conversation && !conversation.isGroupConversation ) return conversationPresenter( conversation?.toJSON(), whoCreatedId );
             return conversation;

          } ) as IConversation;
   }

   async leaveGroupConversation( conversationId: number ) {
      return await this.conversationModel.findByPk( conversationId, {
         include: [
            {
               model: UserModel,
               as: "users",
               attributes: [ "id", "username", "email", "image" ],
            },
            {
               model: MessageModel,
               as: "lastMessage",
            }
         ],
         order: [
            [ { model: UserModel, as: "users" }, "id", "ASC" ],
            [ { model: MessageModel, as: "lastMessage" }, "id", "ASC" ],
         ]
      } )
          .then( conversation => {

             if ( conversation && !conversation.isGroupConversation ) return conversationPresenter( conversation?.toJSON() );
             return conversation;

          } ) as IConversation;
   }

   async deleteMessage( conversationId: number, currentUserId: number ) {
      const conversationWith = await this.conversationUserModel.findAll( {
         where: {
            conversationId,
            userId: {
               [Op.ne]: currentUserId
            }
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const updatedLastMessage = await this.conversationModel.findByPk( conversationId, {
         include: {
            model: MessageModel,
            as: "lastMessage"
         },
         order: [
            [ { model: MessageModel, as: "lastMessage" }, "id", "DESC" ]
         ]
      } )
          .then( conversation => conversation?.lastMessage );

      return { conversationWith, updatedLastMessage };
   }

   async sendMessage( message: IMessage ) {
      const [ conversationForSender, conversationForReceiver, users ] = await Promise.all( [

         this.getConversationService.get( message.conversationId, message.senderId, "sender" ),

         this.getConversationService.get( message.conversationId, message.senderId, "receiver" ),

         this.conversationModel.findByPk( message.conversationId, {
            include: {
               model: UserModel,
               as: "users",
               attributes: [ "id" ],
            }
         } ).then( conversation => conversation?.users.map( u => u.id ) )

      ] );

      return { conversationForSender, conversationForReceiver, users };
   }

   async kickUser( conversationId: number, whoWasKickedId: number, adminId: number ) {
      const conversation = await this.conversationModel.findByPk( conversationId );

      const whoWillSeeChanges = await this.conversationUserModel.findAll( {
         where: {
            conversationId,
            [Op.and]: [
               {
                  userId: {
                     [Op.ne]: adminId
                  }
               },
               {
                  userId: {
                     [Op.ne]: whoWasKickedId
                  }
               }
            ], 
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const whoIsAdmin = await this.userModel.findByPk( adminId, {
         attributes: [ "id", "username", "email", "image" ]
      } );

      return { conversation, whoWillSeeChanges, whoIsAdmin };
   }

   async typing( conversationId: number, whoTypingId: number ) {
      const conversationWith = await this.conversationUserModel.findAll( {
         where: {
            conversationId,
            userId: {
               [Op.ne]: whoTypingId
            }
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const whoTyping = await this.userModel.findByPk( whoTypingId );

      return { conversationWith, whoTyping }
   }

   async stopTyping( conversationId: number, whoIsTypingId: number ) {
      const conversationWith = await this.conversationUserModel.findAll( {
         where: {
            conversationId,
            userId: {
               [Op.ne]: whoIsTypingId
            }
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const whoIsTyping = await this.userModel.findByPk( whoIsTypingId );

      return { conversationWith, whoIsTyping }
   }


}