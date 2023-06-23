import { useRef } from "react";

import { useAppSelector, useInputHandler } from "../../../hook";
import { sendMessageService } from "../../../service";
import { Box, HStack, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { ButtonIcon } from "../../UI";
import { AiOutlineMessage, RxImage } from "react-icons/all";
import { useColorValues } from "../../../constant";

export function ChatBoxBottom() {
   const { value, handleChange, setValue } = useInputHandler();

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const { sendImage, sendMessage, onEnterDown } = sendMessageService(setValue, value);

   const { whoIsTyping } = useAppSelector(state => state.appReducer);

   const { TEXT_AREA, PLACEHOLDER_COLOR, MAIN_COLOR, BLACK_COLOR, MAIN_COLOR_SUPER_LIGHT2 } = useColorValues();

   return (
       <VStack w={ "100%" }
               position={ "relative" }
               spacing={ 0 }>

          { whoIsTyping.status &&
              <VStack position={ "absolute" }
                      bg={ MAIN_COLOR_SUPER_LIGHT2 }
                      rounded={ 10 }
                      padding={ '10px 14px' }
                      bottom={ 100 }>

                <HStack spacing={ 1 }>
                  <Text fontWeight={ "bold" }
                        fontSize={ 13 }
                        color={ MAIN_COLOR }>
                     { whoIsTyping.username }
                  </Text>

                  <Text fontSize={ 13 }
                        color={ BLACK_COLOR }
                        fontStyle={ "italic" }>
                    щось друкує...
                  </Text>
                </HStack>

              </VStack>
          }

          <HStack h={ "100px" }
                  justify={ "center" }
                  w={ "100%" }>

             <ButtonIcon size={ 10 }
                         as={ RxImage }
                         color={ MAIN_COLOR }
                         fn={ handlePick }/>

             <Box w={ "60%" }
                  bg={ TEXT_AREA }
                  rounded={ 15 }
                  padding={ 3 }>

                <Textarea rows={ 1 }
                          autoFocus={ true }
                          resize={ "none" }
                          transition={ "inherit" }
                          bg={ TEXT_AREA }
                          wordBreak={ "break-word" }
                          border={ "none" }
                          onKeyDown={ value !== "" ? onEnterDown : undefined }
                          value={ value }
                          onChange={ handleChange }
                          focusBorderColor={ "transparent" }
                          _placeholder={ { color: PLACEHOLDER_COLOR } }
                          placeholder={ "Написати..." }/>
             </Box>

             <ButtonIcon size={ 10 }
                         as={ AiOutlineMessage }
                         color={ MAIN_COLOR }
                         fn={ value !== "" ? sendMessage : undefined }/>

             <Input style={ { display: "none" } }
                    onChange={ sendImage }
                    type={ "file" }
                    ref={ ref }/>

          </HStack>
       </VStack>
   );
}