import { UseFormRegister } from "react-hook-form";
import { FormControl, FormErrorMessage, FormLabel, Input, ResponsiveValue } from "@chakra-ui/react";
import { useColorValues } from "../../../constant";

interface IFormControl {
   errorMessage: string | undefined;
   labelName?: string;
   fieldName: string;
   register: UseFormRegister<any>;
   isRequired?: boolean;
   textAlign?: ResponsiveValue<any>;
}

export function AppFormControl( { errorMessage, fieldName, labelName, register, isRequired, textAlign }: IFormControl ) {
   const { MAIN_COLOR_LIGHTER, PLACEHOLDER_COLOR, ALERT_COLOR, FONT_COLOR } = useColorValues();

   return (
       <FormControl isInvalid={ Boolean(errorMessage) }
                    isRequired={ isRequired ? isRequired : false }
                    h={ 100 }>

          <FormLabel color={ PLACEHOLDER_COLOR }> { labelName } </FormLabel>

          <Input { ...register(fieldName) }
                 focusBorderColor={ MAIN_COLOR_LIGHTER }
                 _invalid={ { borderColor: "red.500" } }
                 color={ FONT_COLOR }
                 textAlign={ textAlign ? textAlign : "initial" }
                 variant={ "flushed" }/>

          <FormErrorMessage color={ ALERT_COLOR }
                            justifyContent={ textAlign === "center" ? "center" : "initial" }>
             { errorMessage && errorMessage }
          </FormErrorMessage>

       </FormControl>
   );
}