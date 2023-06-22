import { Center, Divider, Input, InputGroup, InputLeftElement, VStack, Box, Spinner } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { RiUserSearchLine } from "react-icons/all";
import { v4 } from "uuid";
import { useAppSelector, useDebounce, useInputHandler } from "../../../hook";
import { getContactsService } from "../../../service";
import { ContactItem } from "../Contact-Item/Contact-Item.tsx";
import { useColorValues } from "../../../constant";

export function ContactsMenu( { isOnlyMessage, onModalClose }: { isOnlyMessage?: boolean, onModalClose: () => void } ) {
   const { value, handleChange } = useInputHandler();

   const debounced = useDebounce( value );

   const { contacts, isLoading } = useAppSelector( state => state.userReducer );

   getContactsService( debounced );

   const { MAIN_COLOR, PLACEHOLDER_COLOR, ICON_COLOR, FONT_COLOR } = useColorValues();

   return (
       <VStack h={ 500 }>

          <Box p={ 2 }>
             <InputGroup w={ 350 }>
                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ "gray.500" }/> }/>
                <Input border={ "none" }
                       focusBorderColor={ "white" }
                       autoFocus={ true }
                       value={ value }
                       color={ FONT_COLOR }
                       onChange={ handleChange }
                       _placeholder={ { color: PLACEHOLDER_COLOR } }
                       placeholder={ "знайти контакт" }/>
             </InputGroup>
          </Box>

          <Divider/>

          { isLoading
              ?
              <Center h={ 500 }>
                 <Spinner size={ "lg" } thickness={ "3px" } color={ MAIN_COLOR }/>
              </Center>
              :
              <>
                 { Boolean( contacts.length )
                     ? <VStack w={ "100%" }
                               paddingTop={ 5 }
                               spacing={ 5 }
                               overflow={ "scroll" }>

                        { contacts.map( user => <ContactItem key={ v4() }
                                                             onModalClose={ onModalClose }
                                                             user={ user }
                                                             canDelete={ !isOnlyMessage }/> ) }

                     </VStack>

                     : <Center w={ "100%" }
                               h={ "100%" }>

                        <Icon as={ RiUserSearchLine }
                              boxSize={ "70px" }
                              color={ ICON_COLOR }/>

                     </Center>
                 }
              </>
          }

       </VStack>
   );
}