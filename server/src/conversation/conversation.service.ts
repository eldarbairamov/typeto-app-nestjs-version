import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConversationModel, ConversationUserModel } from "./model";
import { UserModel } from "../user/model";
import { Op } from "sequelize";
import { MessageModel } from "../message/model/message.model";
import { groupConversationPresenter, privateConversationPresenter } from "./presenter";
import { IConversationList } from "./interface/conversation.interface";

@Injectable()
export class ConversationService {
   constructor(
       @InjectModel( ConversationModel ) private conversationModel: typeof ConversationModel,
       @InjectModel( ConversationUserModel ) private conversationUserModel: typeof ConversationUserModel,
       @InjectModel( UserModel ) private userModel: typeof UserModel,
   ) {
   }

   async createConversation( userIds: number[], conversationName: string | undefined, currentUserId: number ) {
      const isConversationExist = await this.conversationModel.findAll( {
         where: {
            isGroupConversation: false
         },
         include: [
            {
               model: UserModel,
               as: "users",
               where: {
                  id: {
                     [Op.in]: userIds.concat( currentUserId )
                  }
               },
            }
         ],
      } )
          .then( conversation => Boolean( conversation.filter( c => c.users.length === 2 ).length ) );

      if ( isConversationExist && !conversationName ) throw new HttpException( "Conversation with this user is already exists", HttpStatus.BAD_REQUEST );

      const newConversation = await this.conversationModel.create( {
         conversationName,
         isGroupConversation: Boolean( conversationName ),
         adminId: conversationName ? currentUserId : undefined
      } );

      const promises = userIds.map( async ( id ) => await this.conversationUserModel.create( {
         conversationId: newConversation.id,
         userId: id
      } ) );

      await Promise.all( promises.concat( [ this.conversationUserModel.create( {
         conversationId: newConversation.id,
         userId: currentUserId
      } ) ] ) );

      return await this.conversationModel.findByPk( newConversation.id, {
         include: [
            {
               model: UserModel,
               as: "users",
               attributes: [ "id", "username", "email", "image" ],
               through: {
                  attributes: [ "isNewMessagesExist" ],
               },
            },
            {
               model: MessageModel,
               as: "lastMessage",
            }
         ],
         order: [
            [ { model: UserModel, as: "users" }, "id", "ASC" ],
         ]
      } )
          .then( conversation => {
             if ( conversation?.isGroupConversation === true ) return groupConversationPresenter( conversation?.toJSON(), currentUserId! );
             if ( conversation?.isGroupConversation === false ) return privateConversationPresenter( conversation?.toJSON(), currentUserId! );
             return conversation;
          } );
   }

   async getConversationsBySearch( currentUserId: number, searchKey: string, limit: number ): Promise<IConversationList> {
      const [ groupConversations, privateConversation ] = await Promise.all( [

         this.userModel.findByPk( currentUserId, {
            include: {
               model: ConversationModel,
               as: "conversations",
               where: {
                  isGroupConversation: true,
                  conversationName: {
                     [Op.like]: `%${ searchKey }%`
                  }
               },
               through: {
                  attributes: []
               },
               include: [
                  {
                     model: UserModel,
                     as: "users",
                     attributes: [ "id", "username", "email", "image" ],
                     through: {
                        attributes: [ "isNewMessagesExist" ],
                     },
                  },
                  {
                     model: MessageModel,
                     as: "lastMessage"
                  }
               ],
            },
            order: [
               [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
               [ "conversations", "users", "id", "ASC" ],
               [ "conversations", "lastMessage", "id", "ASC" ]
            ]
         } )
             .then( user => {
                const conversations = user?.conversations.map( c => groupConversationPresenter( c.toJSON(), currentUserId ) );
                if ( conversations ) return conversations;
                else return [];
             } ),

         this.userModel.findByPk( currentUserId, {
            include: {
               model: this.conversationModel,
               as: "conversations",
               where: {
                  isGroupConversation: false
               },
               through: {
                  attributes: []
               },
               include: [
                  {
                     model: UserModel,
                     as: "users",
                     attributes: [ "id", "username", "email", "image" ],
                     through: {
                        attributes: [ "isNewMessagesExist" ],
                     },
                  },
                  {
                     model: MessageModel,
                     as: "lastMessage"
                  }
               ],
            },
            order: [
               [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
               [ "conversations", "users", "id", "ASC" ],
               [ "conversations", "lastMessage", "id", "ASC" ]
            ]
         } )
             .then( user => {
                const target = user?.conversations.find( c => c.users.find( u => u.username.match( searchKey ) ) );
                if ( target ) return [ privateConversationPresenter( target.toJSON(), currentUserId ) ];
                else return [];
             } )

      ] );

      return groupConversations.length
          ?
          {
             data: limit ? Array.from( groupConversations ).splice( 0, limit ) : groupConversations,
             count: limit ? Array.from( groupConversations ).splice( 0, limit ).length : groupConversations.length
          }
          :
          {
             data: limit ? Array.from( privateConversation ).splice( 0, limit ) : privateConversation,
             count: limit ? Array.from( privateConversation ).splice( 0, limit ).length : privateConversation.length
          };

   }

   async getConversations( currentUserId: number, limit: number ): Promise<IConversationList> {
      const conversations = await this.userModel.findByPk( currentUserId, {
         include: {
            model: ConversationModel,
            as: "conversations",
            through: {
               attributes: [],
            },
            include: [
               {
                  model: UserModel,
                  as: "users",
                  attributes: [ "id", "username", "email", "image" ],
                  through: {
                     attributes: [ "isNewMessagesExist" ],
                  },
               },
               {
                  model: MessageModel,
                  as: "lastMessage"
               },
            ],
         },
         order: [
            [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
            [ "conversations", "users", "id", "ASC" ],
            [ "conversations", "lastMessage", "id", "ASC" ]
         ],
      } )
          .then( user => {
             const conversations = user?.conversations || undefined;

             if ( conversations ) return conversations.map( c => {
                if ( c.isGroupConversation ) return groupConversationPresenter( c.toJSON(), currentUserId );
                if ( !c.isGroupConversation ) return privateConversationPresenter( c.toJSON(), currentUserId );
             } );

             return conversations;
          } );

      return {
         data: conversations && (limit ? Array.from( conversations ).splice( 0, limit ) : conversations),
         count: conversations && (limit ? Array.from( conversations ).splice( 0, limit ).length : conversations.length)
      };
   }

   async deleteConversation( conversationId: number, currentUserId: number, limit: number ): Promise<IConversationList> {
      const isGroupConversation = await this.conversationModel.findByPk( conversationId ).then( res => Boolean( res?.isGroupConversation === true ) );
      if ( isGroupConversation ) throw new HttpException( "You are not admin. You can not delete group conversation", HttpStatus.UNAUTHORIZED );

      await Promise.all( [
         this.conversationModel.destroy( {
            where: {
               id: conversationId
            }
         } ),
         this.conversationUserModel.destroy( {
            where: {
               conversationId
            }
         } )
      ] );

      const conversations = await UserModel.findByPk( currentUserId, {
         include: {
            model: ConversationModel,
            as: "conversations",
            through: {
               attributes: []
            },
            include: [
               {
                  model: UserModel,
                  as: "users",
                  attributes: [ "id", "username", "email", "image" ],
                  through: {
                     attributes: [ "isNewMessagesExist" ],
                  },
               },
               {
                  model: MessageModel,
                  as: "lastMessage"
               }
            ],
         },
         order: [
            [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
            [ "conversations", "users", "id", "ASC" ],
            [ "conversations", "lastMessage", "id", "ASC" ]
         ]
      } )
          .then( user => {
             const conversations = user?.conversations || undefined;

             if ( conversations ) return conversations.map( c => {
                if ( c.isGroupConversation ) return groupConversationPresenter( c.toJSON(), currentUserId );
                if ( !c.isGroupConversation ) return privateConversationPresenter( c.toJSON(), currentUserId );
             } );

             return conversations;
          } );

      return {
         data: conversations && (limit ? Array.from( conversations ).splice( 0, limit ) : conversations),
         count: conversations && (limit ? Array.from( conversations ).splice( 0, limit ).length : conversations.length)
      };
   }

   async deleteGroupConversation( conversationId: number, currentUserId: number, limit: number ): Promise<IConversationList> {
      const [ isUserAdmin, isGroupConversation ] = await this.conversationModel
          .findByPk( conversationId )
          .then( res => [
             Boolean( res?.adminId === currentUserId ),
             Boolean( res?.isGroupConversation === true )
          ] );

      if ( !isGroupConversation ) throw new HttpException( "It is not group conversation", HttpStatus.BAD_REQUEST );
      if ( !isUserAdmin ) throw new HttpException( "You are not admin", HttpStatus.UNAUTHORIZED );

      await Promise.all( [
         this.conversationModel.destroy( {
            where: {
               id: conversationId
            }
         } ),
         this.conversationUserModel.destroy( {
            where: {
               conversationId
            }
         } )
      ] );

      const conversations = await UserModel.findByPk( currentUserId, {
         include: {
            model: ConversationModel,
            as: "conversations",
            through: {
               attributes: []
            },
            include: [
               {
                  model: UserModel,
                  as: "users",
                  attributes: [ "id", "username", "email", "image" ],
                  through: {
                     attributes: [ "isNewMessagesExist" ],
                  },
               },
               {
                  model: MessageModel,
                  as: "lastMessage"
               }
            ],
         },
         order: [
            [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
            [ "conversations", "users", "id", "ASC" ],
            [ "conversations", "lastMessage", "id", "ASC" ]
         ]
      } )
          .then( user => {
             const conversations = user?.conversations || undefined;

             if ( conversations ) return conversations.map( c => {
                if ( c.isGroupConversation ) return groupConversationPresenter( c.toJSON(), currentUserId );
                if ( !c.isGroupConversation ) return privateConversationPresenter( c.toJSON(), currentUserId );
             } );

             return conversations;
          } );

      return {
         data: conversations && (limit ? Array.from( conversations ).splice( 0, limit ) : conversations),
         count: conversations && (limit ? Array.from( conversations ).splice( 0, limit ).length : conversations.length)
      };
   }

   async leaveGroupConversation( conversationId: number, currentUserId: number, limit: number ): Promise<IConversationList> {
      const [ isUserAdmin, isGroupConversation ] = await this.conversationModel
          .findByPk( conversationId )
          .then( res => [
             Boolean( res?.adminId === currentUserId ),
             Boolean( res?.isGroupConversation === true )
          ] );

      if ( !isGroupConversation ) throw new HttpException( "It is not group conversation", HttpStatus.BAD_REQUEST );
      if ( isUserAdmin ) throw new HttpException( "Admin can not leave own conversation", HttpStatus.BAD_REQUEST );

      await this.conversationUserModel.destroy( {
         where: {
            conversationId,
            userId: currentUserId
         }
      } );

      const conversations = await this.userModel.findByPk( currentUserId, {
         include: {
            model: ConversationUserModel,
            as: "conversations",
            through: {
               attributes: []
            },
            include: [
               {
                  model: UserModel,
                  as: "users",
                  attributes: [ "id", "username", "email", "image" ],
                  through: {
                     attributes: [ "isNewMessagesExist" ],
                  },
               },
               {
                  model: MessageModel,
                  as: "lastMessage"
               }
            ],
         },
         order: [
            [ { model: ConversationModel, as: "conversations", isSelfAssociation: true }, "lastModified", "DESC" ],
            [ "conversations", "users", "id", "ASC" ],
            [ "conversations", "lastMessage", "id", "ASC" ]
         ]
      } )
          .then( user => {
             const conversations = user?.conversations || undefined;

             if ( conversations ) return conversations.map( c => {
                if ( c.isGroupConversation ) return groupConversationPresenter( c.toJSON(), currentUserId );
                if ( !c.isGroupConversation ) return privateConversationPresenter( c.toJSON(), currentUserId );
             } );

             return conversations;
          } );

      return {
         data: conversations && (limit ? Array.from( conversations ).splice( 0, limit ) : conversations),
         count: conversations && (limit ? Array.from( conversations ).splice( 0, limit ).length : conversations.length)
      };
   }

   async kickUserFromGroupConversation( conversationId: number, userId: number ): Promise<void> {
      await this.conversationUserModel.destroy( { where: { conversationId, userId } } );
   }

}