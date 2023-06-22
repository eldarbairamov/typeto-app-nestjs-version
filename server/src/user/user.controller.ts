import { Body, Controller, Delete, Get, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccessGuard } from "../auth/guard";
import { User } from "../common/decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "./model";

@Controller( "users" )
export class UserController {
   constructor(
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       private userService: UserService,
   ) {
   }

   @UseGuards( AccessGuard )
   @Get()
   async findUser(
       @Query( "userEmail" ) userEmail: string,
       @User( "userId" ) userId: number
   ) {
      return this.userService.findUser( userEmail, userId )
   }

   @UseGuards( AccessGuard )
   @Get( "get_current_user" )
   async getCurrentUser( @User( "userId" ) userId: number ) {
      return this.userService.getCurrentUser( userId )
   }

   @UseGuards( AccessGuard )
   @UseInterceptors( FileInterceptor( "avatar" ) )
   @Patch( "avatar" )
   async uploadAvatar(
       @User( "userId" ) userId: number,
       @UploadedFile() file: Express.Multer.File
   ) {
      const { imageName } = await this.userService.uploadAvatar( file, userId )
      return imageName
   }

   @UseGuards( AccessGuard )
   @Delete( "avatar" )
   async deleteAvatar( @User( "userId" ) userId: number ) {
      await this.userService.deleteAvatar( userId )
      return { message: "Success" }
   }

   @UseGuards( AccessGuard )
   @Get( "contacts" )
   async getContacts(
       @User( "userId" ) userId: number,
       @Query( "searchKey" ) searchKey: string
   ) {
      return this.userService.getContacts( searchKey, userId )
   }

   @UseGuards( AccessGuard )
   @Post( "contacts" )
   async addContact(
       @Body( "targetId" ) targetId: number,
       @User( "userId" ) userId: number
   ) {
      await this.userService.addContact( targetId, userId )
      return { message: "Success" }
   }

   @UseGuards( AccessGuard )
   @Delete( "contacts" )
   async deleteContact(
       @Query( "contactId" ) contactId: number,
       @User( "userId" ) userId: number
   ) {
      return this.userService.deleteContact( contactId, userId )
   }

}