import { Alert, HStack, Text } from "@chakra-ui/react";
import { useColorValues } from "../../../constant";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";

export function NewMessageAlert( { scrollToBottom }: { scrollToBottom: () => void } ) {
   const { MAIN_COLOR, MAIN_COLOR_SUPER_LIGHT2 } = useColorValues();

   return (
       <Alert style={ { position: "fixed" } }
              cursor={ "pointer" }
              w={ "fit-content" }
              bg={ "transparent" }
              zIndex={ 100 }
              onClick={ scrollToBottom }>

          <HStack bg={ MAIN_COLOR_SUPER_LIGHT2 }
                  w={ "100%" }
                  p={ 3 }
                  rounded={ 10 }
                  justifyContent={ "center" }>

             <Icon as={ BiBell }
                   color={ MAIN_COLOR }
                   boxSize={ 5 }/>

             <Text fontWeight={ "bold" }
                   color={ MAIN_COLOR }>
                нове повідомлення
             </Text>

          </HStack>

       </Alert>
   );

}