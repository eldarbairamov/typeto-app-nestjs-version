import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IAccessTokenPair } from "../interface/access-token-pair.interface";
import { IEnvironment } from "../../common/interface/env.inteface";

@Injectable()
export class TokenService {

   constructor(
       private jwtService: JwtService,
       private configService: ConfigService<IEnvironment>,
   ) {
   }

   generatePair( payload: any ): IAccessTokenPair {
      try {
         return {
            accessToken: this.jwtService.sign( payload, {
               secret: this.configService.get( "SECRET_ACCESS_TOKEN_KEY" ),
               expiresIn: "1d",
            } ),
            refreshToken: this.jwtService.sign( payload, {
               secret: this.configService.get( "SECRET_REFRESH_TOKEN_KEY" ),
               expiresIn: "7d",
            } ),
         };

      }
      catch ( e ) {
         throw new HttpException( "JWT: Error", HttpStatus.INTERNAL_SERVER_ERROR );
      }
   }

   generate( payload: any, secret: string ): string {
      try {
         return this.jwtService.sign( payload, { secret, expiresIn: "1d" } );
      }
      catch ( e ) {
         throw new HttpException( "JWT: Error", HttpStatus.INTERNAL_SERVER_ERROR );
      }
   }

}