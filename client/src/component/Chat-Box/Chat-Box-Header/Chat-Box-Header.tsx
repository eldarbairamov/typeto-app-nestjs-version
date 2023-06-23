import { Avatar, AvatarGroup, Heading, HStack } from "@chakra-ui/react";
import { v4 } from "uuid";
import { useAppSelector } from "../../../hook";
import { getImageUrl } from "../../../helper";
import { ChatBoxOptions } from "../../../component";
import { useColorValues } from "../../../constant";

export function ChatBoxHeader() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const { FONT_COLOR, AVATAR_BORDER } = useColorValues();

   return (
       <HStack width={ "100%" }
               h={ "60px" }
               spacing={ 0 }
               justify={ "center" }
               style={ { position: "relative" } }>

          <HStack spacing={ 3 }>

             { activeConversation.isGroupConversation

                 ? <AvatarGroup size={ "sm" }>
                    { activeConversation.users.map(user =>
                        <Avatar key={ v4() }
                                name={ user.username }
                                showBorder={ true }
                                borderColor={ AVATAR_BORDER }
                                ignoreFallback={ true }
                                src={ getImageUrl(user.image, user.email) }
                                size={ "sm" }/>
                    ) }
                 </AvatarGroup>

                 : <Avatar name={ activeConversation.conversationWith[0].username }
                           ignoreFallback={ true }
                           showBorder={ true }
                           borderColor={ AVATAR_BORDER }
                           src={ getImageUrl(activeConversation.conversationWith[0].image, activeConversation.conversationWith[0].email) }
                           size={ "sm" }/>

             }

             <Heading size={ "md" }
                      color={ FONT_COLOR }>
                {
                   activeConversation.conversationName
                       ? activeConversation.conversationName
                       : activeConversation.conversationWith[0].username
                }
             </Heading>

          </HStack>

          <ChatBoxOptions/>

       </HStack>

   );
}