import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { InjectModel } from "@nestjs/sequelize";
import { ConversationUserModel, UserModel } from "./model";
import { SessionManagerService } from "./service";
import { EventsService } from "./events.service";
import { Server, Socket } from "socket.io";
import { IMessage, ISocketUser } from "./interface";
import { CYAN_COLOR, GREEN_COLOR, MAGENTA, RED_COLOR } from "./constant/colors.constant";
import { CreateConversationDto, DeleteConversationDto, DeleteGroupConversationDto, DeleteMessageDto, KickUserFromGroupConversationDto, LeaveGroupConversationDto, TypingDto } from "./dto";

@WebSocketGateway( { cors: "*", } )
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

   constructor(
       @InjectModel( ConversationUserModel ) private conversationUserModel: typeof ConversationUserModel,
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       private sessionManagerService: SessionManagerService,
       private eventService: EventsService
   ) {
   }

   @WebSocketServer()
   io: Server;

   users: ISocketUser[] = [];

   handleConnection( socket: Socket, ...args ): any {
      console.log( MAGENTA, "socket: connection" );
      console.log( GREEN_COLOR, "user " + socket.id + " is connected" );
   }

   handleDisconnect( socket: Socket ): any {
      console.log( MAGENTA, "socket: disconnect" );
      console.log( RED_COLOR, "user " + socket.id + " is disconnected" );

      this.users = this.sessionManagerService.removeUser( this.users, socket.id );
      this.io.emit( "refresh_online_users", this.users.map( u => u.userId ) );
   }

   @SubscribeMessage( "add_user" )
   addUser(
       @MessageBody() userId: number,
       @ConnectedSocket() socket: Socket
   ) {
      console.log( MAGENTA, "socket: add_user" );

      this.sessionManagerService.addUser( this.users, userId, socket.id );

      this.io.emit( "who_is_online", this.users.map( u => u.userId ) );
   }

   @SubscribeMessage( "join_to_conversation" )
   joinToConversation(
       @MessageBody() conversationId: number,
       @ConnectedSocket() socket: Socket
   ) {
      console.log( MAGENTA, "socket: join to conversation" );

      socket.join( String( conversationId ) );

      console.log( CYAN_COLOR, "user " + socket.id + " joined to conversation: " + conversationId );
   }

   @SubscribeMessage( "create_conversation" )
   async createConversation(
       @MessageBody() dto: CreateConversationDto,
       @ConnectedSocket() socket: Socket
   ) {
      console.log( MAGENTA, "socket: create_conversation" );

      const { conversationId, whoCreatedId, conversationWith } = dto;

      const conversation = await this.eventService.createConversation( conversationId, whoCreatedId );

      if ( !conversation.isGroupConversation ) {
         const to = String( this.sessionManagerService.getUser( this.users, conversationWith[0] ) );
         this.io.to( to ).emit( "get_conversation", conversation );
      }
      else {
         const to = this.sessionManagerService.getUsers( this.users, conversation.users.map( u => u.id ) ) as string[];
         socket.to( to ).emit( "get_conversation", conversation );
      }
   }

   @SubscribeMessage( "delete_conversation" )
   async deleteConversation(
       @MessageBody() dto: DeleteConversationDto,
       @ConnectedSocket() socket: Socket
   ) {
      console.log( MAGENTA, "socket: delete_conversation" );

      const { conversationId, conversationWith, whoDeleted } = dto;

      const to = String( this.sessionManagerService.getUser( this.users, conversationWith ) );
      this.io.to( to ).emit( "get_delete_result", conversationId, whoDeleted.username );
   }

   @SubscribeMessage( "leave_group_conversation" )
   async leaveGroupConversation(
       @MessageBody() dto: LeaveGroupConversationDto
   ) {
      console.log( MAGENTA, "socket: leave_group_conversation" );

      const { conversationId, conversationWith, whoLeft } = dto;

      const conversation = await this.eventService.leaveGroupConversation( conversationId );

      const to = this.sessionManagerService.getUsers( this.users, conversationWith ) as string[];
      this.io.to( to ).emit( "get_leave_result", conversation, whoLeft );
   }

   @SubscribeMessage( "delete_group_conversation" )
   async deleteGroupConversation(
       @MessageBody() dto: DeleteGroupConversationDto
   ) {
      console.log( MAGENTA, "socket: delete_group_conversation" );

      const { conversationId, conversationWith, adminName } = dto;

      const to = this.sessionManagerService.getUsers( this.users, conversationWith ) as string[];
      if ( to.length ) this.io.to( to ).emit( "get_delete_group_result", conversationId, adminName );
   }

   @SubscribeMessage( "delete_message" )
   async deleteMessage(
       @MessageBody() dto: DeleteMessageDto
   ) {
      console.log( MAGENTA, "socket: delete_message" );

      const { messageId, currentUserId, conversationId } = dto;

      const { conversationWith, updatedLastMessage } = await this.eventService.deleteMessage( conversationId, currentUserId );
      const to = this.sessionManagerService.getUsers( this.users, conversationWith ) as string[];

      if ( to.length ) this.io.to( to ).emit( "delete_message_result", messageId, conversationId, updatedLastMessage );
   }

   @SubscribeMessage( "send_message" )
   async sendMessage(
       @MessageBody() message: IMessage
   ) {
      console.log( MAGENTA, "socket: send_message" );

      const { conversationForSender, conversationForReceiver, users } = await this.eventService.sendMessage( message );

      const to = this.sessionManagerService.getUsers( this.users, users! ) as string[];
      this.io.to( to ).emit( "get_message", message, conversationForSender, conversationForReceiver );
   }

   @SubscribeMessage( "kick_user_from_group_conversation" )
   async kickUserFromGroupConversation(
       @MessageBody() dto: KickUserFromGroupConversationDto
   ) {
      console.log( MAGENTA, "socket: kick_user_from_group_conversation" );

      const { conversationId, whoWasKickedId, adminId } = dto;

      const { whoIsAdmin, whoWillSeeChanges, conversation } = await this.eventService.kickUser( conversationId, whoWasKickedId, adminId );

      const toUsers = this.sessionManagerService.getUsers( this.users, whoWillSeeChanges! ) as string[];
      const toKickedUser = this.sessionManagerService.getUser( this.users, whoWasKickedId );

      toUsers.length && this.io.to( toUsers ).emit( "kick_user_result", whoWasKickedId, conversationId );
      toKickedUser && this.io.to( toKickedUser ).emit( "i_was_kicked", `Адмін ${ whoIsAdmin?.username } видалив вас із бесіди "${ conversation?.conversationName }"`, conversationId );
   }

   @SubscribeMessage( "typing" )
   async typing(
       @MessageBody() dto: TypingDto
   ) {
      console.log( MAGENTA, "socket: typing" );

      const { whoTypingId, conversationId } = dto;

      const { whoTyping, conversationWith } = await this.eventService.typing( conversationId, whoTypingId );

      const to = this.sessionManagerService.getUsers( this.users, conversationWith ) as string[];
      to.length && this.io.to( to ).emit( "someone_is_typing", conversationId, whoTyping?.username );
   }

   @SubscribeMessage( "stop_typing" )
   async stopTyping( @MessageBody() dto: TypingDto ) {
      console.log( MAGENTA, "socket: stop_typing" );

      const { conversationId, whoTypingId } = dto;

      const { whoIsTyping, conversationWith } = await this.eventService.stopTyping( conversationId, whoTypingId );

      const to = this.sessionManagerService.getUsers( this.users, conversationWith ) as string[];
      to.length && this.io.to( to ).emit( "someone_is_stop_typing", conversationId, whoIsTyping?.username );
   }

}