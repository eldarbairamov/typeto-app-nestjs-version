import { IsNotEmpty, IsNumber } from "class-validator";

export class KickUserFromGroupConversationDto {
   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly whoWasKickedId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly adminId: number
}