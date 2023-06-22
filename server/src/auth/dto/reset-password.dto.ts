import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {

   @IsString()
   @IsNotEmpty()
   readonly resetPasswordToken: string;

   @IsString()
   @IsNotEmpty()
   @MinLength( 6 )
   @MaxLength( 20 )
   readonly password: string;

}