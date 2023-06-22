import { v4 } from "uuid";
import { Divider, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, VStack } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAppSelector } from "../../../hook";
import { useColorValues } from "../../../constant";
import { ConversationUserItem } from "../../../component";
import { conversationOptionsService } from "../../../service";

export function ChatBoxOptions() {
   const { activeConversation } = useAppSelector( state => state.conversationReducer );

   const { currentUserInfo } = useAppSelector( state => state.userReducer );

   const { deleteConversation, deleteGroupConversation, leaveGroupConversation } = conversationOptionsService( activeConversation );

   const { MAIN_COLOR, BG_SECOND, WHITE_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR_SUPER_LIGHT } = useColorValues();

   const { colorMode } = useColorMode();

   return (
       <Menu autoSelect={ false }>

          <MenuButton style={ { position: "absolute", right: 30 } }
                      as={ IconButton }
                      _active={ { bg: colorMode === "dark" ? BUTTON_HOVER_COLOR : MAIN_COLOR_SUPER_LIGHT } }
                      _hover={ { bg: colorMode === "dark" ? BUTTON_HOVER_COLOR : MAIN_COLOR_SUPER_LIGHT } }
                      p={ 1 }
                      border={ "none" }
                      icon={ <HamburgerIcon boxSize={ 5 } color={ MAIN_COLOR }/> }
                      variant={ "outline" }/>

          <MenuList rounded={ 10 }
                    bg={ BG_SECOND }
                    p={ 1 }>

             <VStack w={ "100%" }>

                { activeConversation.isGroupConversation &&
                    <>
                        <VStack p={ 5 }
                                spacing={ 5 }>

                           { activeConversation.users && activeConversation?.users.map( item =>
                               <ConversationUserItem key={ v4() }
                                                     user={ item }/>
                           ) }

                        </VStack>

                        <Divider/>
                    </>
                }

                <MenuItem _hover={ { bg: "none" } }
                          bg={ BG_SECOND }
                          onClick={
                             activeConversation.adminId === currentUserInfo.id ? deleteGroupConversation :
                                 activeConversation.isGroupConversation ? leaveGroupConversation : deleteConversation }>

                   <Text w={ "100%" }
                         rounded={ 5 }
                         p={ 2 }
                         textAlign={ "center" }
                         fontWeight={ "bold" }
                         _hover={ { bg: MAIN_COLOR, color: WHITE_COLOR } }
                         color={ MAIN_COLOR }>

                      { (activeConversation.adminId === currentUserInfo.id || !activeConversation.isGroupConversation) ? "Завершити бесіду" : "Покинути бесіду" }

                   </Text>

                </MenuItem>

             </VStack>

          </MenuList>

       </Menu>
   );
}