import { Body, Controller, Delete, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModel } from "../user/model";
import { Request } from "express";
import { User } from "../common/decorator";
import { AccessGuard, LoginGuard, RefreshGuard, RegistrationGuard } from "./guard";
import { RegistrationDto, ResetPasswordDto } from "./dto";

@Controller( "auth" )
export class AuthController {
   constructor( private authService: AuthService ) {
   }

   @UseGuards( RegistrationGuard )
   @Post( "registration" )
   async registration( @Body() dto: RegistrationDto ) {
      await this.authService.registration( dto )
      return { message: "Success" }
   }

   @UseGuards( LoginGuard )
   @Post( "login" )
   async login( @Req() request: Request & { user: UserModel } ) {
      return this.authService.login( request.user )
   }

   @Post( "forgot_password" )
   async forgotPassword(
       @Req() request: Request,
       @Body( "email" ) email: string
   ) {
      const clientUrl = request.headers.origin;
      await this.authService.forgotPassword( email, clientUrl )
      return { message: "Success" }
   }

   @Patch( "reset_password" )
   async resetPassword( @Body() dto: ResetPasswordDto ) {
      await this.authService.resetPassword( dto )
      return { message: "Success" }
   }

   @UseGuards( AccessGuard )
   @Delete( "logout" )
   async logout( @User( "token" ) token: string ) {
      await this.authService.logout( token )
      return { message: "Success" }
   }

   @UseGuards( RefreshGuard )
   @Post( "refresh" )
   async refresh(
       @User() user: { userId: number, refreshToken: string }
   ) {
      return this.authService.refresh( user.refreshToken, user.userId )
   }

}