import { useState } from "react";

import moment from "moment/moment";
import { Avatar, Heading, HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { IMessage } from "../../../interface";
import { useAppSelector, useContextMenu } from "../../../hook";
import { deleteMessageService } from "../../../service";
import { AppModal, MessagePopover, ShowImage } from "../../../component";
import { useColorValues } from "../../../constant";
import { getImageUrl } from "../../../helper";

interface IOutcomingMessage {
   message: IMessage;
}

export function OutcomingMessage( { message }: IOutcomingMessage ) {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const { isCtxMenuOpen, openCtxMenu, closeCtxMenu } = useContextMenu();

   const [ content, setContent ] = useState<JSX.Element>();

   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const openImage = () => {
      setContent(<ShowImage image={ message.content } userEmail={ message.sender.email }/>);
      onOpen();
   };

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const { deleteMessage } = deleteMessageService(message);

   const { FONT_COLOR, MAIN_COLOR, AVATAR_BORDER, WHITE_COLOR, MESSAGE_OUTCOMING_COLOR } = useColorValues();

   return (
       <VStack alignItems={ "flex-end" }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <MessagePopover isOpen={ isCtxMenuOpen }
                             deleteMessage={ deleteMessage }
                             onClose={ closeCtxMenu }>

                <VStack maxW={ [ null, null, null, 300, 600 ] }
                        bg={ message.isImage ? "transparent" : MESSAGE_OUTCOMING_COLOR }
                        alignItems={ "flex-end" }
                        cursor={ "pointer" }
                        borderRadius={ "20px 0 20px 20px" }
                        transition={ ".3s" }
                        _hover={ message.isImage ? { transform: "scale(1.015)" } : { transform: "scale(1.05)" } }
                        style={ isCtxMenuOpen ? (message.isImage ? { transform: "scale(1.015)" } : { transform: "scale(1.05)" }) : {} }
                        onContextMenu={ openCtxMenu }
                        spacing={ message.isImage ? 7 : 1 }
                        p={ 5 }>

                   <Heading size={ "sm" }
                            color={ message.isImage ? MAIN_COLOR : WHITE_COLOR }>
                      { message.sender.username }
                   </Heading>

                   { message.isImage
                       ? <Image src={ getImageUrl(message.content, message.sender.email) }
                                rounded={ 20 }
                                transition={ ".3s" }
                                onClick={ openImage }
                                h={ [ "100px", "200px", "300px", "300px", "500px" ] }/>

                       : <Text color={ WHITE_COLOR }> { message.content } </Text>
                   }

                </VStack>
             </MessagePopover>

             <VStack>
                <Avatar name={ message.sender.username }
                        ignoreFallback={ true }
                        showBorder={ true }
                        borderColor={ AVATAR_BORDER }
                        src={ getImageUrl(currentUserInfo.image, currentUserInfo.email) }
                        size={ "md" }/>

                <Text color={ FONT_COLOR }> { conversationTime } </Text>
             </VStack>;

          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }
                    p={ 0 }/>;

       </VStack>
   )
       ;
}