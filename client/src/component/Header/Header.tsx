import { useState } from "react";

import { Highlight, HStack, Text, useColorMode, useDisclosure } from "@chakra-ui/react";
import { BiSearch, IoMdLogOut, FiUsers, FaRegLightbulb, FaLightbulb } from "react-icons/all";
import { logoutService } from "../../service";
import { useColorValues } from "../../constant";
import { AppModal, ButtonIcon, ProfileInfo, FindUser, ContactsMenu } from "../../component";

export function Header() {
   const { colorMode, toggleColorMode } = useColorMode();

   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const openFindUsers = () => {
      setContent( <FindUser onModalClose={ onClose }/> );
      onOpen();
   };

   const openFriendList = () => {
      setContent( <ContactsMenu onModalClose={ onClose }/> );
      onOpen();
   };

   const { logout } = logoutService();

   const { ICON_COLOR, LOGO_COLOR, MAIN_COLOR, WHITE_COLOR } = useColorValues();

   return (
       <HStack w={ "95%" }
               spacing={ 0 }
               paddingTop={ 5 }
               alignItems={ "flex-start" }
               justify={ "space-between" }
               h={ "100px" }>

          <Text cursor={ "default" }
                ml={ 5 }
                color={ LOGO_COLOR }
                fontWeight={ "bold" }
                fontSize={ 30 }>

             <Highlight query={ "to" }
                        styles={ {
                           color: WHITE_COLOR,
                           p: "5px 10px",
                           marginLeft: 1,
                           borderRadius: "10px 0 10px 10px",
                           bg: MAIN_COLOR
                        } }>
                typeto
             </Highlight>

          </Text>

          <HStack spacing={ 0 }>

             <ProfileInfo/>

             <ButtonIcon size={ 8 }
                         as={ FiUsers }
                         rounded={ 5 }
                         color={ ICON_COLOR }
                         p={ 5 }
                         fn={ openFriendList }/>

             <ButtonIcon size={ 8 }
                         as={ BiSearch }
                         rounded={ 5 }
                         color={ ICON_COLOR }
                         p={ 5 }
                         fn={ openFindUsers }/>

             <ButtonIcon size={ 7 }
                         as={ colorMode === "light" ? FaRegLightbulb : FaLightbulb }
                         rounded={ 5 }
                         color={ ICON_COLOR }
                         p={ 5 }
                         fn={ toggleColorMode }/>

             <ButtonIcon size={ 8 }
                         as={ IoMdLogOut }
                         rounded={ 5 }
                         color={ ICON_COLOR }
                         p={ 5 }
                         fn={ logout }/>
          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }/>

       </HStack>
   );
}