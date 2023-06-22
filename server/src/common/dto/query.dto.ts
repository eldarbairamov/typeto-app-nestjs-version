import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryDto {
   @IsOptional()
   @IsString()
   readonly searchKey: string;

   @IsOptional()
   @IsNumber()
   readonly limit: number;
}
