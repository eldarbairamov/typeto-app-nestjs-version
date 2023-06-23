import { Alert, HStack, Spinner, Text } from "@chakra-ui/react";
import { useColorValues } from "../../../constant";

export function ImageLoader() {
   const { MAIN_COLOR, MAIN_COLOR_SUPER_LIGHT2 } = useColorValues();

   return (
       <Alert style={ { position: "fixed" } }
              w={ "fit-content" }
              bg={ "transparent" }
              zIndex={ 100 }>

          <HStack bg={ MAIN_COLOR_SUPER_LIGHT2 }
                  w={ "100%" }
                  p={ 3 }
                  rounded={ 10 }
                  spacing={ 3 }
                  justifyContent={ "center" }>

             <Spinner size={ "sm" }
                      thickness={ "2px" }
                      color={ MAIN_COLOR }/>

             <Text color={ MAIN_COLOR }
                   fontWeight={ "bold" }>
                зачекайте...
             </Text>

          </HStack>

       </Alert>
   );
}