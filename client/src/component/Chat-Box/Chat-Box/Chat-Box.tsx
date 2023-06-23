import { useAppSelector } from "../../../hook";
import { getMessageService } from "../../../service";
import { calc, HStack, VStack } from "@chakra-ui/react";
import { MessageList, ChatBoxBottom, ChatBoxHeader } from "../../../component";
import { useColorValues } from "../../../constant";

export function ChatBox() {
   const { activeConversation, conversations } = useAppSelector( state => state.conversationReducer );

   getMessageService( activeConversation );

   const { BG_SECOND } = useColorValues();

   return (
       <HStack w={ "100%" }
               spacing={ 0 }
               justify={ "space-between" }
               h={ "100%" }>

          { Boolean( conversations.length ) &&
              <VStack h={ "100%" }
                      borderRadius={ "0 20px 20px 0" }
                      w={ "100%" }
                      transition={ "3000ms" }
                      bg={ BG_SECOND }
                      spacing={ 0 }>

                  <ChatBoxHeader/>

                  <VStack h={ calc( "100%" ).subtract( "60px" ).toString() }
                          w={ "100%" }
                          spacing={ 0 }>

                      <MessageList/>

                      <ChatBoxBottom/>

                  </VStack>

              </VStack>
          }

       </HStack>
   );
}