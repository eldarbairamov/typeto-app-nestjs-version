import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { IsEvenNumber } from "../validator";

export class DeleteGroupConversationDto {
   @IsString()
   @IsNotEmpty()
   readonly adminName: string

   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsArray()
   @ArrayNotEmpty()
   @Validate( IsEvenNumber, { message: "conversationWith: values must be a number" } )
   readonly conversationWith: number[];
}