import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ActionTokenModel, OAuthModel } from "./model";
import { JwtModule } from "@nestjs/jwt";
import { UserModel } from "../user/model";
import { EmailService } from "../common/service/email.service";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { PasswordService, TokenService } from "./service";
import { AccessStrategy, LoginStrategy, RefreshStrategy } from "./strategy";

@Module( {
   imports: [
      SequelizeModule.forFeature( [ OAuthModel, ActionTokenModel, UserModel ] ),
      JwtModule.register( {} ),
      PassportModule
   ],
   controllers: [ AuthController ],
   providers: [ AuthService, PasswordService, TokenService, EmailService, ConfigService, LoginStrategy, AccessStrategy, RefreshStrategy ]
} )
export class AuthModule {

}