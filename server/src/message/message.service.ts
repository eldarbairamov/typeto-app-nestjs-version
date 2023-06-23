import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MessageModel } from "./model/message.model";
import { UserModel } from "../user/model";
import { ConversationModel, ConversationUserModel } from "../conversation/model";
import { Op } from "sequelize";
import { ImageService } from "../common/service";

@Injectable()
export class MessageService {
   constructor(
       @InjectModel( MessageModel ) private messageModel: typeof MessageModel,
       @InjectModel( ConversationModel ) private conversationModel: typeof ConversationModel,
       @InjectModel( ConversationUserModel ) private conversationUserModel: typeof ConversationUserModel,
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       private imageService: ImageService
   ) {
   }

   async sendMessage( content: string, senderId: number, conversationId: number ): Promise<MessageModel> {
      const newMessage = await this.messageModel.create( {
         content,
         senderId,
         conversationId
      } );

      const [ messageWithSender ] = await Promise.all( [
         this.messageModel.findByPk( newMessage.id, {
            include: {
               model: UserModel,
               as: "sender",
               attributes: [ "id", "username", "email", "image" ]
            }
         } ),
         this.conversationModel.update( {
                lastModified: Date.now()
             },
             {
                where: {
                   id: conversationId
                }
             } ),
         this.conversationUserModel.update( {
            isNewMessagesExist: true
         }, {
            where: {
               conversationId,
               userId: {
                  [Op.ne]: senderId
               }
            }
         } )
      ] );

      return messageWithSender;
   }

   async getMessages( conversationId: number, currentUserId: number ): Promise<MessageModel[]> {
      const [ messages ] = await Promise.all( [
         this.messageModel.findAll( {
            where: { conversationId },
            attributes: [ "id", "content", "conversationId", "lastModified", "isImage" ],
            include: {
               model: UserModel,
               as: "sender",
               attributes: [ "id", "username", "email", "image" ]
            },
            order: [
               [ "id", "ASC" ]
            ]
         } ),
         this.conversationUserModel.update( {
            isNewMessagesExist: false
         }, {
            where: {
               conversationId,
               userId: currentUserId
            }
         } )
      ] );

      return messages;
   };

   async sendImage( file: Express.Multer.File, senderId: number, conversationId: number ): Promise<MessageModel> {
      const user = await this.userModel.findByPk( senderId );

      const { imageName } = await this.imageService.process( file, user.email );

      const newMessage = await this.messageModel.create( {
         content: imageName,
         conversationId,
         senderId,
         isImage: true
      } );

      const [ messageWithSender ] = await Promise.all( [
         this.messageModel.findByPk( newMessage.id, {
            include: {
               model: UserModel,
               as: "sender",
               attributes: [ "id", "username", "email", "image" ]
            }
         } ),
         this.conversationModel.update( {
                lastModified: Date.now()
             },
             {
                where: {
                   id: conversationId
                }
             } ),
         this.conversationUserModel.update( {
            isNewMessagesExist: true
         }, {
            where: {
               conversationId,
               userId: {
                  [Op.ne]: senderId
               }
            }
         } )
      ] );

      return messageWithSender;
   }

   async deleteMessage( conversationId: number, messageId: number, currentUserId: number ): Promise<MessageModel> {
      const [ message, user ] = await Promise.all( [
         this.messageModel.findOne( {
            where: { conversationId, id: messageId },
            attributes: [ "content", "isImage" ]
         } ),
         this.userModel.findByPk( currentUserId )
      ] );

      if ( !message ) throw new HttpException( "Message does not exist", 400 );

      if ( message.isImage && user ) await this.imageService.delete( message.content, user.email );

      await this.messageModel.destroy( { where: { id: messageId } } );

      return await this.conversationModel.findByPk( conversationId, {
         include: {
            model: MessageModel,
            as: "lastMessage"
         },
         order: [
            [ { model: MessageModel, as: "lastMessage" }, "id", "DESC" ]
         ]
      } )
          .then( conversation => conversation?.lastMessage );
   }

}