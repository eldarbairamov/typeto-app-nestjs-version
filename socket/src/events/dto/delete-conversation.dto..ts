import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class WhoDeletedDto {
   @IsNumber()
   @IsNotEmpty()
   readonly id: number

   @IsString()
   @IsNotEmpty()
   readonly username: string
}

export class DeleteConversationDto {
   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly conversationWith: number;

   @ValidateNested()
   @Type( () => WhoDeletedDto )
   readonly whoDeleted: WhoDeletedDto
}