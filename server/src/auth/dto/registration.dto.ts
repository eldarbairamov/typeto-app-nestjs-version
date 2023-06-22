import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegistrationDto {

   @IsString()
   @IsNotEmpty()
   readonly username: string;

   @IsEmail()
   @IsNotEmpty()
   readonly email: string;

   @IsString()
   @MinLength( 6 )
   @MaxLength( 20 )
   @IsNotEmpty()
   readonly password: string;

}