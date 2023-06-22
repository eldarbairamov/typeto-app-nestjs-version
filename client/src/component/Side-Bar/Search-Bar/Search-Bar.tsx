import { useEffect } from "react";

import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { conversationActions } from "../../../store/slice";
import { useAppDispatch, useDebounce, useInputHandler } from "../../../hook";
import { useColorValues } from "../../../constant";

export function SearchBar( { height, width }: { height?: string | number, width?: string | number } ) {
   const { value, handleChange } = useInputHandler();

   const debounced = useDebounce( value );

   const dispatch = useAppDispatch();

   const { BG_SECOND, PLACEHOLDER_COLOR, MAIN_COLOR, FONT_COLOR } = useColorValues();

   useEffect( () => {
      if ( debounced.length >= 1 ) dispatch( conversationActions.setSearchKey( debounced ) );
      if ( debounced.length < 1 ) dispatch( conversationActions.setSearchKey( undefined ) );
   }, [ debounced ] );

   return (
       <Center bg={ BG_SECOND }
               rounded={ 20 }
               height={ height ? height : "60px" }
               w={ width ? width : "90%" }>

          <InputGroup w={ "90%" }>
             <InputLeftElement pointerEvents={ "none" }
                               children={ <Search2Icon color={ MAIN_COLOR }/> }/>

             <Input border={ "none" }
                    focusBorderColor={ "white" }
                    onChange={ handleChange }
                    value={ value }
                    color={ FONT_COLOR }
                    _placeholder={ { color: PLACEHOLDER_COLOR } }
                    placeholder={ "знайти діалог" }/>
          </InputGroup>

       </Center>
   );
}