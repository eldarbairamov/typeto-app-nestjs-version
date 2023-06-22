import { Avatar, Heading, HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import moment from "moment";
import { IMessage } from "../../../interface";
import { getImageUrl } from "../../../helper";
import { useColorValues } from "../../../constant";
import { AppModal } from "../../UI";
import { useState } from "react";
import { ShowImage } from "../Show-Image/Show-Image.tsx";

interface IIncomingMessage {
   message: IMessage;
}

export function IncomingMessage( { message }: IIncomingMessage ) {
   const conversationTime = moment( +message.lastModified ).format( "HH:mm" );

   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const openImage = () => {
      setContent( <ShowImage image={ message.content } userEmail={ message.sender.email }/> );
      onOpen();
   };

   const { BLACK_COLOR, MAIN_COLOR, MESSAGE_INCOMING_COLOR, FONT_COLOR, AVATAR_BORDER } = useColorValues();

   return (
       <VStack alignItems={ "flex-start" }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack>
                <Avatar name={ message.sender.username }
                        ignoreFallback={ true }
                        showBorder={ true }
                        borderColor={ AVATAR_BORDER }
                        src={ getImageUrl( message.sender.image, message.sender.email ) }
                        size={ "md" }/>

                <Text color={ FONT_COLOR }> { conversationTime } </Text>
             </VStack>

             <VStack maxW={ [ null, null, null, 300, 600 ] }
                     bg={ message.isImage ? "transparent" : MESSAGE_INCOMING_COLOR }
                     alignItems={ "flex-start" }
                     rounded={ "0 20px 20px 20px" }
                     spacing={ message.isImage ? 7 : 1 }
                     p={ 5 }>

                <Heading size={ "sm" }
                         color={ message.isImage ? MAIN_COLOR : BLACK_COLOR }>
                   { message.sender.username }
                </Heading>

                { message.isImage
                    ? <Image src={ getImageUrl( message.content, message.sender.email ) }
                             borderRadius={ 20 }
                             cursor={ "pointer" }
                             onClick={ openImage }
                             h={ [ "100px", "200px", "300px", "300px", "500px" ] }/>

                    : <Text color={ BLACK_COLOR }> { message.content } </Text>
                }

             </VStack>

          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }
                    p={ 0 }/>

       </VStack>
   );
}