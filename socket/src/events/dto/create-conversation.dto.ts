import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, Validate } from "class-validator";
import { IsEvenNumber } from "../validator";

export class CreateConversationDto {
   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsNumber()
   @IsNotEmpty()
   readonly whoCreatedId: number;

   @IsArray()
   @ArrayNotEmpty()
   @Validate( IsEvenNumber, { message: "conversationWith: values must be a number" } )
   readonly conversationWith: number[]
}