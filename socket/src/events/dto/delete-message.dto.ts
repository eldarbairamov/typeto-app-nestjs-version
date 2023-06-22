import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteMessageDto {
   @IsNumber()
   @IsNotEmpty()
   readonly messageId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly currentUserId: number
}