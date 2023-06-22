import { IsNumber, IsOptional } from "class-validator";

export class CommonConversationQueryDto {
   @IsOptional()
   @IsNumber()
   readonly conversationId: number;

   @IsOptional()
   @IsNumber()
   readonly limit: number;
}
