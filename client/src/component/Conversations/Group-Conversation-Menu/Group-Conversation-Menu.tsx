import React, { useRef, useState } from "react";

import { Center, Input, InputGroup, InputLeftElement, VStack, Box, HStack, Avatar, Heading, Button, Spinner } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { RiUserSearchLine } from "react-icons/all";
import { v4 } from "uuid";
import { useAppSelector } from "../../../hook";
import { TypedOnChange } from "../../../interface";
import { groupConvMenuService } from "../../../service";
import { ContactItem } from "../../Contacts";
import { getImageUrl } from "../../../helper";
import { useColorValues } from "../../../constant";

export function GroupConversationMenu( { isOnlyMessage, onModalClose }: { isOnlyMessage?: boolean, onModalClose: () => void } ) {
   const { groupMembers } = useAppSelector(state => state.conversationReducer);

   const { contacts, isLoading } = useAppSelector(state => state.userReducer);

   const [ values, setValues ] = useState<{ searchValue: string, groupName: string }>({
      searchValue: "",
      groupName: ""
   });

   const handleChange = ( e: TypedOnChange, fieldName: string ) => {
      setValues({
         ...values,
         [fieldName]: e.target.value
      });
   };

   const ref = useRef<HTMLButtonElement>(null);

   const { createGroupConversation, deleteContactFromGroup } = groupConvMenuService(onModalClose, values);

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLInputElement> ) => {
      if (e.key === "Enter") {
         e.preventDefault();
         ref.current?.click();
      }
   };

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, AVATAR_BORDER, PLACEHOLDER_COLOR, WHITE_COLOR, FONT_COLOR } = useColorValues();

   if (isLoading) {
      return (
          <Center h={ 650 }>
             <Spinner size={ "lg" } thickness={ "3px" } color={ MAIN_COLOR }/>
          </Center>
      );
   }

   return (
       <VStack h={ 650 }>

          <VStack spacing={ 5 }
                  p={ 5 }
                  w={ "100%" }>

             { Boolean(!groupMembers.length)
                 ? <Heading size={ "md" }
                            color={ FONT_COLOR }> Оберіть учасників </Heading>

                 : <VStack spacing={ 7 }>
                    <Heading size={ "md" }
                             color={ FONT_COLOR }> Учасники </Heading>

                    <HStack>
                       { groupMembers && groupMembers.map(member =>
                           <Avatar cursor={ "pointer" }
                                   key={ v4() }
                                   showBorder={ true }
                                   borderColor={ AVATAR_BORDER }
                                   src={ getImageUrl(member.image, member.email) }
                                   size={ "sm" }
                                   name={ member.username }
                                   onClick={ () => deleteContactFromGroup(member) }/>
                       ) }
                    </HStack>
                 </VStack>
             }

          </VStack>

          <Box p={ 2 }>
             <InputGroup w={ 350 }>
                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ "gray.500" }/> }/>
                <Input border={ "none" }
                       value={ values.searchValue }
                       color={ FONT_COLOR }
                       onChange={ ( e ) => handleChange(e, "searchValue") }
                       _placeholder={ { color: PLACEHOLDER_COLOR } }
                       placeholder={ "знайти контакт" }/>
             </InputGroup>
          </Box>

          { contacts
              ? <VStack w={ "100%" }
                        h={ "100%" }
                        paddingTop={ 5 }
                        spacing={ 5 }
                        overflow={ "scroll" }>

                 { contacts.map(user => <ContactItem key={ v4() }
                                                     onModalClose={ onModalClose }
                                                     isOnlyForAdding={ true }
                                                     user={ user }
                                                     canDelete={ !isOnlyMessage }/>) }

              </VStack>

              : <Center w={ "100%" }
                        h={ "100%" }>

                 <Icon as={ RiUserSearchLine }
                       boxSize={ "70px" }
                       color={ "gray.300" }/>

              </Center>
          }

          <VStack w={ "100%" }
                  h={ 200 }>

             <Input w={ "70%" }
                    variant={ "flushed" }
                    h={ 12 }
                    fontSize={ 16 }
                    onKeyDown={ onEnterDown }
                    border={ "none" }
                    _focus={ { borderColor: "transparent" } }
                    value={ values.groupName }
                    onChange={ ( e ) => handleChange(e, "groupName") }
                    textAlign={ "center" }
                    _placeholder={ { color: PLACEHOLDER_COLOR } }
                    placeholder={ "введіть назву бесіди" }/>

             <Button size={ "lg" }
                     rounded={ 8 }
                     ref={ ref }
                     bg={ BUTTON_COLOR }
                     color={ WHITE_COLOR }
                     _hover={ { bg: BUTTON_HOVER_COLOR } }
                     onClick={ createGroupConversation }
                     isDisabled={ !groupMembers.length || values.groupName == "" }
                     w={ "80%" }>
                Створити
             </Button>

          </VStack>

       </VStack>
   );
}