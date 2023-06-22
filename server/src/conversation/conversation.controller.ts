import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AccessGuard } from "../auth/guard";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ConversationService } from "./conversation.service";
import { User } from "../common/decorator";
import { QueryDto } from "../common/dto/query.dto";
import { IsConversationExists } from "./guard/is-conversation-exists.guard";
import { CommonConversationQueryDto } from "./dto/common-conversation-query.dto";

@Controller( "conversations" )
export class ConversationController {

   constructor( private conversationService: ConversationService ) {
   }

   @UseGuards( AccessGuard )
   @Post()
   async createConversation(
       @Body() dto: CreateConversationDto,
       @User( "userId" ) userId: number
   ) {
      return this.conversationService.createConversation( dto.userIds, dto.conversationName, userId );
   }

   @UseGuards( AccessGuard )
   @Get()
   async getConversations(
       @Query() dto: QueryDto,
       @User( "userId" ) userId: number
   ) {
      if ( dto.searchKey ) return await this.conversationService.getConversationsBySearch( userId, dto.searchKey, dto.limit );
      else return this.conversationService.getConversations( userId, dto.limit );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Delete()
   async deleteConversation(
       @Query() dto: CommonConversationQueryDto,
       @User( "userId" ) userId: number
   ) {
      return this.conversationService.deleteConversation( dto.conversationId, userId, dto.limit );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Delete( "admin" )
   async deleteGroupConversation(
       @Query() dto: CommonConversationQueryDto,
       @User( "userId" ) userId: number
   ) {
      return this.conversationService.deleteGroupConversation( dto.conversationId, userId, dto.limit );
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Delete( "admin/kick" )
   async kickUserFromGroupConversation( @Query() dto: { conversationId: number, userId: number } ) {
      await this.conversationService.kickUserFromGroupConversation( dto.conversationId, dto.userId );
      return { message: "Success" };
   }

   @UseGuards( AccessGuard )
   @UseGuards( IsConversationExists )
   @Delete( "leave" )
   async leaveGroupConversation(
       @Query() dto: CommonConversationQueryDto,
       @User( "userId" ) userId: number
   ) {
      await this.conversationService.leaveGroupConversation( dto.conversationId, userId, dto.limit );
      return { message: "Success" };
   }

}