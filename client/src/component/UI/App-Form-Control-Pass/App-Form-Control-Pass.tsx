import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { UseFormRegister } from "react-hook-form";
import { useHidePass } from "../../../hook";
import { useColorValues } from "../../../constant";

interface IAppFormControlPass {
   errorMessage: string | undefined;
   register: UseFormRegister<any>;
   labelName: string;
   fieldName: string;
   isRequired?: boolean;
}

export function AppFormControlPass( { labelName, fieldName, errorMessage, register, isRequired }: IAppFormControlPass ) {
   const { MAIN_COLOR_LIGHTER, PLACEHOLDER_COLOR, ALERT_COLOR, FONT_COLOR } = useColorValues();

   const { isShow, handleClick } = useHidePass();

   return (
       <FormControl isInvalid={ Boolean( errorMessage ) }
                    isRequired={ isRequired ? isRequired : false }
                    h={ 100 }>

          <FormLabel color={ PLACEHOLDER_COLOR }> { labelName } </FormLabel>

          <InputGroup>

             <Input { ...register( fieldName ) }
                    autoComplete={ "" }
                    focusBorderColor={ MAIN_COLOR_LIGHTER }
                    color={ FONT_COLOR }
                    variant={ "flushed" }
                    _invalid={ { borderColor: ALERT_COLOR } }
                    type={ isShow ? "text" : "password" }/>

             <InputRightElement>

                <Button variant={ "unstyled" }
                        onClick={ handleClick }>
                   { isShow ?
                       <ViewOffIcon boxSize={ 5 }
                                    color={ PLACEHOLDER_COLOR }/>
                       :
                       <ViewIcon boxSize={ 5 }
                                 color={ PLACEHOLDER_COLOR }/>
                   }
                </Button>

             </InputRightElement>

          </InputGroup>

          <FormErrorMessage color={ ALERT_COLOR }>
             { errorMessage && errorMessage }
          </FormErrorMessage>

       </FormControl>
   );
}