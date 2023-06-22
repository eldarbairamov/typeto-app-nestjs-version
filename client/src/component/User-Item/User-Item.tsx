import { Avatar, AvatarBadge, Heading, HStack } from "@chakra-ui/react";
import { AiOutlineMessage, FiUserPlus, FiUserCheck } from "react-icons/all";
import { useState } from "react";
import { IUserBySearch } from "../../interface";
import { addContactService, createConversationService } from "../../service";
import { getImageUrl } from "../../helper";
import { useColorValues } from "../../style/colors.theme.ts";
import { ButtonIcon } from "../UI";
import { useAppSelector } from "../../hook";

interface IUserItemProps {
   user: IUserBySearch,
   onModalClose: () => void
}

export function UserItem( { user, onModalClose }: IUserItemProps ) {
   const [ isAdded, setIsAdded ] = useState<boolean>(user.isAlreadyAdded);

   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const { addContact } = addContactService(user, setIsAdded);

   const { createConversation } = createConversationService(user, onModalClose);

   const { FONT_COLOR, ICON_COLOR, AVATAR_BORDER, MAIN_COLOR } = useColorValues();

   return (
       <HStack w={ "85%" }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>

             <Avatar name={ user.username }
                     ignoreFallback={ true }
                     showBorder={ true }
                     borderColor={ AVATAR_BORDER }
                     src={ getImageUrl(user.image, user.email) }
                     size={ "md" }>

                { onlineContactsIds.includes(user.id) &&
                    <AvatarBadge boxSize={ 5 }
                                 borderColor={ "white" }
                                 bg={ MAIN_COLOR }/>
                }

             </Avatar>

             <Heading size={ "md" } color={ FONT_COLOR }> { user.username } </Heading>

          </HStack>

          <HStack spacing={ 1 }>

             <ButtonIcon size={ "25px" }
                         p={0}
                         as={ currentUserInfo.id === user.id ? undefined : AiOutlineMessage }
                         color={ ICON_COLOR }
                         fn={ createConversation }/>

             <ButtonIcon size={ "25px" }
                         p={0}
                         as={ currentUserInfo.id === user.id ? undefined : isAdded ? FiUserCheck : FiUserPlus }
                         cursor={ isAdded ? "default" : "pointer" }
                         color={ ICON_COLOR }
                         fn={ isAdded ? undefined : addContact }/>

          </HStack>

       </HStack>
   );
}