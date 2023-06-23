import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../user/model";
import { EmailService } from "../common/service";
import { ActionTokenModel, OAuthModel } from "./model";
import { ConfigService } from "@nestjs/config";
import { IEnvironment } from "../common/interface/env.inteface";
import { PasswordService, TokenService } from "./service";
import { RegistrationDto, ResetPasswordDto } from "./dto";
import { FORGOT_PASSWORD, REGISTRATION, RESET_PASSWORD_TOKEN_TYPE } from "../common/constant";

@Injectable()
export class AuthService {

   constructor(
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       @InjectModel( OAuthModel ) private oAuthModel: typeof OAuthModel,
       @InjectModel( ActionTokenModel ) private actionToken: typeof ActionTokenModel,
       private emailService: EmailService,
       private passwordService: PasswordService,
       private tokenService: TokenService,
       private configService: ConfigService<IEnvironment>
   ) {
   }

   async registration( dto: RegistrationDto ) {
      await this.userModel.create( { email: dto.email, username: dto.username, password: dto.password } );
      await this.emailService.send( dto.email, REGISTRATION, { username: dto.username } );
   }

   async login( user: UserModel ) {
      const tokenPair = this.tokenService.generatePair( { userId: user.id } );
      await this.oAuthModel.create( { ownerId: user.id, ...tokenPair } );
      return { ...tokenPair };
   }

   async forgotPassword( email: string, clientUrl: string ) {
      const user = await this.userModel.findOne( { where: { email } } );
      if ( !user ) throw new HttpException( "User is not found", HttpStatus.UNAUTHORIZED );

      const resetPasswordToken = this.tokenService.generate( { userId: user.id }, this.configService.get( "SECRET_RESET_PASS_KEY" ) );
      const resetPasswordLink = `${ clientUrl }/reset_password/new?token=${ resetPasswordToken }`;

      await this.actionToken.create( {
         token: resetPasswordToken,
         tokenType: RESET_PASSWORD_TOKEN_TYPE,
         ownerId: user.id,
      } );

      await this.emailService.send( email, FORGOT_PASSWORD, { resetPasswordLink, username: user.username } );
   }

   async resetPassword( dto: ResetPasswordDto ) {
      const actionTokenInfo = await this.actionToken.findOne( { where: { token: dto.resetPasswordToken } } );
      if ( !actionTokenInfo ) throw new HttpException( "Token invalid or expired", HttpStatus.UNAUTHORIZED );

      await actionTokenInfo.destroy();
      await this.userModel.update( { password: dto.password }, {
         where: { id: actionTokenInfo.ownerId },
         individualHooks: true
      } );

   }

   async logout( token: string ): Promise<void> {
      await this.oAuthModel.destroy( { where: { accessToken: token } } );
   }

   async refresh( refreshToken: string, userId: number ) {
      const accessTokenPair = this.tokenService.generatePair( { userId } );

      await Promise.all( [
         this.oAuthModel.destroy( { where: { refreshToken } } ),
         this.oAuthModel.create( { ...accessTokenPair, ownerId: userId } ),
      ] );

      return accessTokenPair;
   }

   async validateUser( email: string, password: string ) {
      const user = await this.userModel.findOne( { where: { email } } );

      const isPasswordValid = user ? await this.passwordService.passComparer( password, user.password ) : null;

      if ( !user || !isPasswordValid ) return null;

      return user;
   }
}