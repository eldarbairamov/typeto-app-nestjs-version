import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LoginStrategy extends PassportStrategy( Strategy, "login" ) {

   constructor( private authService: AuthService ) {
      super( { usernameField: "email" } );
   }

   async validate( email: string, password: string ): Promise<any> {
      const user = await this.authService.validateUser( email, password );

      if ( !user ) throw new HttpException( "Wrong email or password", HttpStatus.UNAUTHORIZED );

      return user;
   }

}