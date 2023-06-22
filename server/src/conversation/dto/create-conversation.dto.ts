import { ArrayNotEmpty, IsArray, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint( { name: "isEvenNumber" } )
export class IsEvenNumber implements ValidatorConstraintInterface {
   validate( values: number[], args?: ValidationArguments ) {
      return values.every( num => typeof num === "number" );
   }
}

export class CreateConversationDto {
   @IsArray()
   @ArrayNotEmpty()
   @Validate( IsEvenNumber, { message: "userIds: values must be a number" } )
   readonly userIds: number[];

   @IsString()
   @IsOptional()
   readonly conversationName?: string;
}