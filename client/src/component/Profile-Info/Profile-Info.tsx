import { useRef } from "react";

import { Avatar, Button, Divider, IconButton, Input, Menu, MenuButton, MenuList, Text, VStack } from "@chakra-ui/react";
import { CgProfile } from "react-icons/all";
import { useAppSelector } from "../../hook";
import { getImageUrl } from "../../helper";
import { avatarService } from "../../service";
import { useColorValues } from "../../constant";

export function ProfileInfo() {
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const { deleteAvatar, uploadAvatar } = avatarService();

   const { MAIN_COLOR, BG_SECOND, WHITE_COLOR, AVATAR_BORDER } = useColorValues();

   return (
       <Menu>
          <MenuButton _active={ { bg: "none" } }
                      _hover={ { bg: "none" } }
                      bg={ "none" }
                      as={ IconButton }
                      mr={ 5 }
                      aria-label={ "Options" }
                      icon={ CgProfile({ color: MAIN_COLOR, size: 29 }) }/>

          <MenuList rounded={ 20 }
                    bg={ BG_SECOND }
                    boxShadow={ "xl" }>

             <VStack w={ "100%" }
                     h={ "100%" }
                     p={ 5 }
                     spacing={ 5 }>

                <VStack spacing={ 5 }>

                   <Avatar name={ currentUserInfo.username }
                           showBorder={ true }
                           borderColor={ AVATAR_BORDER }
                           src={ getImageUrl(currentUserInfo.image, currentUserInfo.email) }
                           size={ "2xl" }/>

                   <Text fontWeight={ "black" }
                         fontSize={ 15 }>
                      { currentUserInfo.username }
                   </Text>

                </VStack>

                <Divider/>

                <VStack w={ "100%" }>

                   <Button w={ "100%" }
                           _hover={ { bg: "transparent", color: MAIN_COLOR } }
                           variant={ "ghost" }
                           onClick={ handlePick }
                           fontWeight={ "normal" }>
                      Змінити фото
                   </Button>

                   { currentUserInfo.image &&
                       <Button w={ "100%" }
                               variant={ "ghost" }
                               color={ MAIN_COLOR }
                               _hover={ { bg: MAIN_COLOR, color: WHITE_COLOR } }
                               onClick={ deleteAvatar }
                               fontWeight={ "normal" }>
                         Видалити
                       </Button>
                   }

                </VStack>

                <Input type={ "file" }
                       display={ "none" }
                       ref={ ref }
                       onChange={ uploadAvatar }/>

             </VStack>

          </MenuList>

       </Menu>
   );
}