import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { IConversation, IUserFromConversation } from "../../../interface";
import { conversationActions } from "../../../store/slice";
import { Avatar, AvatarBadge, AvatarGroup, Divider, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import { useColorValues } from "../../../constant";
import { v4 } from "uuid";
import { getImageUrl } from "../../../helper";
import { Icon } from "@chakra-ui/icons";
import { AiTwotoneMessage } from "react-icons/all";
import { ForwardedRef, forwardRef } from "react";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

export const ConversationItem = forwardRef( ( { user, conversation }: IConversationProps, ref: ForwardedRef<any> ) => {
   const { activeConversation } = useAppSelector( state => state.conversationReducer );

   const { onlineContactsIds } = useAppSelector( state => state.userReducer );

   const dispatch = useAppDispatch();

   const selectConversation = () => {
      dispatch( conversationActions.setActiveConversation( {
         ...conversation,
         username: user?.username
      } ) );
   };

   const conversationTime = moment( +conversation.lastModified ).format( "HH:mm" );

   const { FONT_SECOND, FONT_COLOR, AVATAR_BORDER, CONVERSATION_ACTIVE_COLOR, MAIN_COLOR, WHITE_COLOR } = useColorValues();

   return (
       <VStack width={ "100%" } ref={ ref }>

          <VStack width={ "100%" }
                  bg={ conversation.id === activeConversation.id ? CONVERSATION_ACTIVE_COLOR : undefined }
                  p={ 4 }
                  rounded={ 10 }
                  justify={ "center" }
                  h={ "80px" }
                  spacing={ 5 }
                  onClick={ selectConversation }
                  cursor={ "pointer" }>

             <HStack w={ "100%" }
                     justify={ "space-between" }>

                <HStack spacing={ 5 }>

                   { conversation.isGroupConversation &&
                       <AvatarGroup size={ "md" }
                                    max={ 2 }>
                          { conversation.users.map( user =>
                              <Avatar key={ v4() }
                                      showBorder={ true }
                                      borderColor={ AVATAR_BORDER }
                                      name={ user.username }
                                      src={ getImageUrl( user.image, user.email ) }
                                      ignoreFallback={ true }
                                      size={ "lg" }>
                                 { onlineContactsIds.includes( user.id ) && <AvatarBadge boxSize={ 4 }
                                                                                         borderColor={ "white" }
                                                                                         bg={ MAIN_COLOR }/> }
                              </Avatar> ) }
                       </AvatarGroup>
                   }

                   { user &&
                       <Avatar name={ user?.username }
                               showBorder={ true }
                               borderColor={ AVATAR_BORDER }
                               src={ getImageUrl( user.image, user.email ) }
                               ignoreFallback={ true }
                               size={ "lg" }>
                          { onlineContactsIds.includes( user.id ) && <AvatarBadge boxSize={ 5 }
                                                                                  borderColor={ "white" }
                                                                                  bg={ MAIN_COLOR }/> }
                       </Avatar>
                   }

                   <VStack alignItems={ "flex-start" }
                           h={ "100%" }
                           justify={ "center" }>

                      <Heading size={ "ьв" }
                               color={ conversation.id === activeConversation.id ? WHITE_COLOR : "default" }>
                         { conversation.isGroupConversation ? conversation.conversationName : user?.username }
                      </Heading>

                      <Text color={ conversation.id === activeConversation.id ? WHITE_COLOR : FONT_SECOND }
                            noOfLines={ 1 }>
                         {
                            (conversation.lastMessage?.content && !conversation.lastMessage.isImage)
                                ? conversation.lastMessage.content
                                : conversation.lastMessage?.isImage
                                    ? "зображення"
                                    : ""
                         }
                      </Text>

                   </VStack>

                </HStack>

                <VStack h={ "100%" }
                        justify={ "space-between" }>

                   <Text color={ conversation.id === activeConversation.id ? WHITE_COLOR : FONT_COLOR }>
                      { conversationTime }
                   </Text>

                   { conversation.isNewMessagesExist &&
                       <Icon as={ AiTwotoneMessage }
                             boxSize={ 4 }
                             color={ MAIN_COLOR }/>
                   }

                </VStack>

             </HStack>

          </VStack>

          <Divider w={ 250 }/>

       </VStack>
   );
} );