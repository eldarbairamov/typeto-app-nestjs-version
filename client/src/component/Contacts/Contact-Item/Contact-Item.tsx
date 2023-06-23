import { Avatar, AvatarBadge, Heading, HStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { IUser } from "../../../interface";
import { createConversationService } from "../../../service";
import { conversationActions, userActions, userAsyncActions } from "../../../store/slice";
import { getImageUrl } from "../../../helper";
import { AiOutlineDelete, AiOutlineMessage, AiOutlineUsergroupAdd } from "react-icons/all";
import { useColorValues } from "../../../constant";
import { ButtonIcon } from "../../UI";

interface IUserItemProps {
   user: IUser,
   canDelete?: boolean,
   onModalClose?: () => void,
   isOnlyForAdding?: boolean
}

export function ContactItem( { user, canDelete, onModalClose, isOnlyForAdding }: IUserItemProps ) {
   const { onlineContactsIds } = useAppSelector( state => state.userReducer );

   const dispatch = useAppDispatch();

   const { createConversation } = createConversationService( user, onModalClose );

   const addContactToGroup = () => {
      dispatch( conversationActions.addContactToGroup( user ) );
      dispatch( userActions.groupModeMove( { id: user.id, action: "add" } ) );
   };

   const { AVATAR_BORDER, ICON_COLOR, MAIN_COLOR, FONT_COLOR } = useColorValues();

   return (
       <HStack w={ "85%" }
               p={ 1 }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>

             <Avatar name={ user.username }
                     ignoreFallback={ true }
                     showBorder={ true }
                     borderColor={ AVATAR_BORDER }
                     src={ getImageUrl( user.image, user.email ) }
                     size={ "md" }>

                { onlineContactsIds.includes( user.id ) &&
                    <AvatarBadge boxSize={ 4 }
                                 borderColor={ "white" }
                                 bg={ MAIN_COLOR }/>
                }

             </Avatar>

             <Heading size={ "md" }
                      color={ FONT_COLOR }>
                { user.username }
             </Heading>

          </HStack>

          <HStack spacing={ 1 }>

             <ButtonIcon size={ isOnlyForAdding ? "29px" : "25px" }
                         p={ 0 }
                         fn={ isOnlyForAdding ? addContactToGroup : createConversation }
                         color={ ICON_COLOR }
                         as={ isOnlyForAdding ? AiOutlineUsergroupAdd : AiOutlineMessage }/>

             { canDelete &&
                 <ButtonIcon size={ "25px" }
                             p={ 0 }
                             fn={ () => dispatch( userAsyncActions.deleteContact( { contactId: user.id } ) ) }
                             color={ ICON_COLOR }
                             as={ AiOutlineDelete }/>
             }

          </HStack>

       </HStack>
   );
}