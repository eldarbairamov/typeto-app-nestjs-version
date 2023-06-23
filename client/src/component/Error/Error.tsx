import { useRouteError } from "react-router-dom";
import { Center, HStack, Text, Divider } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BsEmojiSmileUpsideDown } from "react-icons/all";
import { useColorValues } from "../../style/colors.theme.ts";

export function Error() {
   const error = useRouteError();

   console.log( error );

   const { FONT_COLOR, BG, MAIN_COLOR } = useColorValues();

   return (
       <Center h={ "100vh" }
               bg={ BG }>

          <HStack spacing={ 6 }>
             <Icon as={ BsEmojiSmileUpsideDown }
                   boxSize={ "30px" }
                   color={ MAIN_COLOR }/>

             <Divider orientation={ "vertical" }
                      h={ 6 }
                      borderWidth={ 1 }
                      borderColor={ FONT_COLOR }/>

             <Text fontSize={ 20 }
                   fontWeight={ 500 }
                   color={ FONT_COLOR }>
                упс, щось пішло не так...
             </Text>

          </HStack>

       </Center>
   );
}