import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/sequelize";
import { OAuthModel } from "../model";
import { IEnvironment } from "../../common/interface/env.inteface";

@Injectable()
export class RefreshStrategy extends PassportStrategy( Strategy, "refresh" ) {

   constructor(
       @InjectModel( OAuthModel ) private oAuthModel: typeof OAuthModel,
       private configService: ConfigService<IEnvironment>
   ) {
      super( {
         jwtFromRequest: ExtractJwt.fromBodyField( "refreshToken" ),
         ignoreExpiration: false,
         secretOrKey: configService.get( "SECRET_REFRESH_TOKEN_KEY" ),
         passReqToCallback: true,
      } );
   }

   async validate( req: Request, decoded: any ) {
      const refreshToken = req.body.refreshToken;

      const isTokenActual = await this.oAuthModel.findOne( { where: { refreshToken } } );
      if ( !isTokenActual ) throw new HttpException( "Invalid or expired token", HttpStatus.UNAUTHORIZED );

      const userId = decoded.userId;
      return { userId, refreshToken };
   }

}