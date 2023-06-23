import { IUserFromConversation } from "../../../interface";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { appActions, conversationAsyncActions } from "../../../store/slice";
import { Avatar, Heading, HStack } from "@chakra-ui/react";
import { getImageUrl } from "../../../helper";
import { ButtonIcon } from "../../UI";
import { BiCrown, FiUserMinus } from "react-icons/all";
import { useColorValues } from "../../../constant";

export function ConversationUserItem( { user }: { user: IUserFromConversation } ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const kickUserFromGroupConversation = async ( userId: number ) => {
      const result = await dispatch(conversationAsyncActions.kickUserFromGroupConversation({
         userId, conversationId: activeConversation.id
      }));
      if (conversationAsyncActions.kickUserFromGroupConversation.rejected.match(result)) {
         dispatch(appActions.setActionMessage({ message: result.payload, type: "error" }));
      }
   };

   const { AVATAR_BORDER, ICON_COLOR, FONT_COLOR } = useColorValues();

   return (
       <HStack justify={ "space-between" }
               w={ activeConversation.isGroupConversation ? 250 : undefined }>

          <HStack w={ "100%" }
                  spacing={ 4 }>

             <Avatar name={ user.username }
                     showBorder={ true }
                     borderColor={ AVATAR_BORDER }
                     src={ getImageUrl(user.image, user.email) }
                     size={ "sm" }/>

             <Heading size={ "sm" } color={ FONT_COLOR }> { user.username } </Heading>

          </HStack>

          { activeConversation.adminId === currentUserInfo.id
              ? <ButtonIcon size={ 6 }
                            color={ ICON_COLOR }
                            cursor={ activeConversation.adminId === user.id ? "default" : "pointer" }
                            fn={ activeConversation.adminId !== user.id ? () => kickUserFromGroupConversation(user.id) : undefined }
                            as={ activeConversation.adminId === user.id ? BiCrown : FiUserMinus }/>

              : <ButtonIcon size={ 6 }
                            color={ ICON_COLOR }
                            cursor={ "default" }
                            as={ activeConversation.adminId === user.id ? BiCrown : undefined }/>
          }


       </HStack>
   );
}