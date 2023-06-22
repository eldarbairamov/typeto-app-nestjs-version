import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../user/model";
import { RegistrationDto } from "../dto";

@Injectable()
export class RegistrationGuard implements CanActivate {
   constructor( @InjectModel( UserModel ) private userModel: typeof UserModel ) {
   }

   async canActivate( context: ExecutionContext ) {
      const request = context.switchToHttp().getRequest();
      const candidate = request.body as RegistrationDto;

      const [ email, username ] = await Promise.all( [
         this.userModel.findOne( { where: { email: candidate.email } } ),
         this.userModel.findOne( { where: { username: candidate.username } } )
      ] )

      if ( email ) throw new HttpException( "This email is already in use", HttpStatus.CONFLICT )
      if ( username ) throw new HttpException( "This username is already in use", HttpStatus.CONFLICT )

      return true
   }
}