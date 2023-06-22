import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { IsEvenNumber } from "../validator";

export class LeaveGroupConversationDto {
   @IsNumber()
   @IsNotEmpty()
   readonly conversationId: number;

   @IsArray()
   @ArrayNotEmpty()
   @Validate( IsEvenNumber, { message: "conversationWith: values must be a number" } )
   readonly conversationWith: number[];

   @IsString()
   @IsNotEmpty()
   readonly whoLeft: string;
}