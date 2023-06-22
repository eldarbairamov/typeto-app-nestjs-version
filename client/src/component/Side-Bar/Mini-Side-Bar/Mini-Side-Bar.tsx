import { useState } from "react";

import { Box, calc, Center, IconButton, Menu, MenuButton, MenuList, useDisclosure, VStack } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/all";
import { useColorValues } from "../../../constant";
import { ConversationList, MiniConversation, AppModal, ButtonIcon, GroupConversationMenu, SearchBar } from "../../../component";
import { useAppDispatch, useObserver } from "../../../hook";
import { conversationActions } from "../../../store/slice";

export function MiniSideBar() {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const createGroupConversation = () => {
      setContent( <GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/> );
      onOpen();
   };

   const dispatch = useAppDispatch();

   const { lastElemRef } = useObserver( () => {
      dispatch( conversationActions.limitIncrease() );
   } );

   const { BG_SECOND, MAIN_COLOR } = useColorValues();

   return (
       <VStack borderRadius={ "20px 0 0 20px" }
               spacing={ 0 }
               bg={ BG_SECOND }
               w={ "130px" }
               h={ "100%" }>

          <Center h={ "60px" }>
             <Menu autoSelect={ false }>
                <MenuButton as={ IconButton }
                            _active={ { bg: "transparent" } }
                            _hover={ { bg: "transparent" } }
                            p={ 1 }
                            border={ "none" }
                            icon={ <Search2Icon boxSize={ 5 } color={ MAIN_COLOR }/> }
                            variant={ "outline" }/>

                <MenuList rounded={ 10 }
                          bg={ BG_SECOND }
                          p={ 0 }>
                   <SearchBar height={ "45px" } width={ "100%" }/>
                </MenuList>
             </Menu>
          </Center>

          <Box p={ "0 20px 0 20px" }
               h={ calc( "100%" ).subtract( "160px" ).toString() }
               alignItems={ "flex-start" }
               w={ "100%" }>

             <ConversationList Conversation={ MiniConversation } ref={ lastElemRef }/>

          </Box>

          <Center h={ "100px" }>
             <ButtonIcon size={ 30 }
                         as={ FiUsers }
                         color={ MAIN_COLOR }
                         fn={ createGroupConversation }/>
          </Center>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }/>

       </VStack>
   );
}