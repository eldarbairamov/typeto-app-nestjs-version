import { IsNotEmpty, IsNumber } from "class-validator";

export class TypingDto {
   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly whoTypingId: number
}