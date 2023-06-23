import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AccessGuard } from "../auth/guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "../common/decorator";
import { InjectModel } from "@nestjs/sequelize";
import { MessageModel } from "./model/message.model";
import { IsConversationExists } from "../conversation/guard/is-conversation-exists.guard";

@Controller( "messages" )
export class MessageController {

   constructor(
       @InjectModel( MessageModel ) private messageModel: typeof MessageModel,
       private messageService: MessageService
   ) {
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Post( ":conversationId" )
   async sendMessage(
       @Body( "content" ) content: string,
       @Param( "conversationId" ) conversationId: number,
       @User( "userId" ) userId: number ): Promise<MessageModel> {
      return this.messageService.sendMessage( content, userId, conversationId );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @UseInterceptors( FileInterceptor( "image" ) )
   @Post( ":conversationId/image" )
   async sendImage(
       @User( "userId" ) userId: number,
       @Param( "conversationId" ) conversationId: number,
       @UploadedFile() file: Express.Multer.File ): Promise<MessageModel> {
      return this.messageService.sendImage( file, userId, conversationId );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Get( ":conversationId" )
   async getMessages(
       @Param( "conversationId" ) conversationId: number,
       @User( "userId" ) userId: number ): Promise<MessageModel[]> {
      return this.messageService.getMessages( conversationId, userId );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Delete( ":conversationId" )
   async deleteMessage(
       @User( "userId" ) userId: number,
       @Param( "conversationId" ) conversationId: number,
       @Query( "messageId" ) messageId: number ): Promise<MessageModel> {
      return this.messageService.deleteMessage( conversationId, messageId, userId );
   }


}