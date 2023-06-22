import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint( { name: "isEvenNumber" } )
export class IsEvenNumber implements ValidatorConstraintInterface {
   validate( values: number[], args?: ValidationArguments ) {
      return values.every( num => typeof num === "number" );
   }
}