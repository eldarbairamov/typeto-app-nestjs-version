import { Button, Center, Divider, HStack, Text } from "@chakra-ui/react";
import { useColorValues } from "../../style/colors.theme.ts";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../router";
import { storageApi } from "../../api";
import { useAppDispatch } from "../../hook";
import { authActions } from "../../store/slice";

export function UnauthorizedPage() {
   const { FONT_COLOR, BUTTON_COLOR, WHITE_COLOR, BUTTON_HOVER_COLOR } = useColorValues();

   const dispatch = useAppDispatch();

   const login = async () => {
      storageApi.deleteTokens();
      dispatch( authActions.logout() );
      UnauthorizedRouter.navigate( UnauthorizedRoutesEnum.LoginPage );
   };

   return (
       <Center h={ "100vh" }>

          <HStack spacing={ 6 }>

             <Text fontSize={ 20 }
                   whiteSpace={ "nowrap" }
                   fontWeight={ 500 }
                   color={ FONT_COLOR }>
                Ви не авторизовані
             </Text>

             <Divider orientation={ "vertical" }
                      h={ 6 }
                      borderWidth={ 1 }
                      borderColor={ FONT_COLOR }/>

             <Button size={ "lg" }
                     rounded={ 8 }
                     bg={ BUTTON_COLOR }
                     color={ WHITE_COLOR }
                     onClick={ login }
                     _hover={ { bg: BUTTON_HOVER_COLOR } }
                     w={ "80%" }>
                Увійти?
             </Button>

          </HStack>

       </Center>
   );
}