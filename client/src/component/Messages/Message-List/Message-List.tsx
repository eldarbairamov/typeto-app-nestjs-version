import { calc, Center, Spinner, useDisclosure, VStack } from "@chakra-ui/react";
import { v4 } from "uuid";
import { useAppSelector } from "../../../hook";
import { scrollService } from "../../../service";
import { OutcomingMessage, IncomingMessage } from "../../Messages";
import { ImageLoader, NewMessageAlert } from "../../UI";
import { useColorValues } from "../../../constant";

export function MessageList() {
   const { currentUserInfo } = useAppSelector( state => state.userReducer );

   const { isMessagesLoading, messages, isNewMessageAdded, isImageSending, prevMessagesLength } = useAppSelector( state => state.messageReducer );

   const { isOpen: isVisible, onClose, onOpen, } = useDisclosure();

   const { messageListRef, scrollToBottom } = scrollService(
       isNewMessageAdded,
       prevMessagesLength,
       messages,
       onClose,
       onOpen );

   const { MAIN_COLOR } = useColorValues();

   if ( isMessagesLoading ) {
      return (
          <Center w={ "100%" }
                  h={ calc( "100%" ).subtract( "100px" ).toString() }>
             <Spinner size={ "xl" } thickness={ "5px" } color={ MAIN_COLOR }/>
          </Center>
      );
   }

   return (
       <VStack h={ calc( "100%" ).subtract( "100px" ).toString() }
               spacing={ -5 }
               ref={ messageListRef }
               p={ "0 40px 0 40px" }
               overflow={ "scroll" }
               w={ "100%" }>

          { Boolean( messages.length ) && messages.map( message => {
             if ( message.sender.id === currentUserInfo.id ) {
                return <OutcomingMessage key={ v4() }
                                         message={ message }/>;
             }
             if ( message.sender.id !== currentUserInfo.id ) {
                return <IncomingMessage key={ v4() }
                                        message={ message }/>;
             }
          } ) }

          { (isImageSending) && <ImageLoader/> }

          { isVisible && <NewMessageAlert scrollToBottom={ scrollToBottom }/> }

       </VStack>
   );
}