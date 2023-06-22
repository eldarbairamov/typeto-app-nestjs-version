import { Avatar, AvatarBadge, AvatarGroup, Center, Divider, Tooltip, VStack } from "@chakra-ui/react";
import { conversationActions } from "../../../store/slice";
import { IConversation, IUserFromConversation } from "../../../interface";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { v4 } from "uuid";
import { getImageUrl } from "../../../helper";
import { ForwardedRef, forwardRef } from "react";
import { useColorValues } from "../../../constant";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

export const MiniConversation = forwardRef( ( { user, conversation }: IConversationProps, ref: ForwardedRef<any> ) => {
   const { activeConversation } = useAppSelector( state => state.conversationReducer );
   const { onlineContactsIds } = useAppSelector( state => state.userReducer );

   const dispatch = useAppDispatch();

   const selectConversation = () => {
      dispatch( conversationActions.setActiveConversation( {
         ...conversation,
         username: user?.username
      } ) );
   };

   const { CONVERSATION_ACTIVE_COLOR, MAIN_COLOR, AVATAR_BORDER } = useColorValues();

   return (
       <Tooltip placement={ "right" }
                hasArrow={ true }
                p={ "5px 15px" }
                rounded={ 5 }
                ref={ ref }
                label={ conversation.conversationName ? conversation.conversationName : conversation.conversationWith[0].username }>

          <VStack width={ "100%" }>

             <Center p={ 4 }
                     bg={ conversation.id === activeConversation.id ? CONVERSATION_ACTIVE_COLOR : undefined }
                     w={ "100%" }
                     rounded={ 10 }
                     onClick={ selectConversation }
                     cursor={ "pointer" }>

                { conversation.isGroupConversation &&
                    <AvatarGroup size={ "sm" }
                                 max={ 1 }>
                       { conversation.users.map( user =>
                           <Avatar key={ v4() }
                                   showBorder={ true }
                                   borderColor={ AVATAR_BORDER }
                                   src={ getImageUrl( user.image, user.email ) }
                                   ignoreFallback={ true }
                                   name={ user.username }
                                   size={ "md" }>

                              { onlineContactsIds.includes( user.id )
                                  && <AvatarBadge boxSize={ 3 }
                                                  borderColor={ "white" }
                                                  bg={ MAIN_COLOR }/>
                              }

                           </Avatar> )
                       }
                    </AvatarGroup>
                }

                { user &&
                    <Avatar name={ user?.username }
                            showBorder={ true }
                            borderColor={ AVATAR_BORDER }
                            src={ getImageUrl( user.image, user.email ) }
                            ignoreFallback={ true }
                            size={ "md" }>

                       { onlineContactsIds.includes( user.id )
                           && <AvatarBadge boxSize={ 4 }
                                           borderColor={ "white" }
                                           bg={ MAIN_COLOR }/>
                       }

                    </Avatar>
                }

             </Center>

             <Divider width={ 50 }/>

          </VStack>
       </Tooltip>
   );
} );