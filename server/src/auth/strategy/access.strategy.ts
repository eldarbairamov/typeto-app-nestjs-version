import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/sequelize";
import { OAuthModel } from "../model";
import { ConfigService } from "@nestjs/config";
import { IEnvironment } from "../../common/interface/env.inteface";
import { Request } from "express";

@Injectable()
export class AccessStrategy extends PassportStrategy( Strategy, "access" ) {

   constructor(
       @InjectModel( OAuthModel ) private oAuthModel: typeof OAuthModel,
       private configService: ConfigService<IEnvironment>
   ) {
      super( {
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: configService.get( "SECRET_ACCESS_TOKEN_KEY" ),
         passReqToCallback: true,
      } );
   }

   async validate( req: Request, decoded: any ) {
      const accessToken = req.headers.authorization?.split( " " )[1];

      const isTokenActual = await this.oAuthModel.findOne( { where: { accessToken } } );
      if ( !isTokenActual ) throw new HttpException( "Invalid or expired token", HttpStatus.UNAUTHORIZED );

      const userId = decoded.userId;
      return { userId, token: accessToken };
   }

}