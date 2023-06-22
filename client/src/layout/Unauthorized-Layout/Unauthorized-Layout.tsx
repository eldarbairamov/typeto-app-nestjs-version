import { Outlet } from "react-router-dom";
import { ButtonIcon, Toast } from "../../component";
import { useAppSelector } from "../../hook";
import { HStack, useColorMode } from "@chakra-ui/react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/all";
import { useColorValues } from "../../style/colors.theme.ts";

export function UnauthorizedLayout() {
   const { actionMessage, actionType } = useAppSelector(state => state.appReducer);

   const { colorMode, toggleColorMode } = useColorMode();

   const { ICON_COLOR } = useColorValues();

   return (
       <>

          <HStack position={ "absolute" }
                  right={ 10 }
                  top={ 5 }>

             <ButtonIcon size={ 7 }
                         as={ colorMode === "light" ? FaRegLightbulb : FaLightbulb }
                         rounded={ 5 }
                         color={ ICON_COLOR }
                         p={ 5 }
                         fn={ toggleColorMode }/>

          </HStack>

          <Outlet/>

          <Toast actionMessage={ actionMessage }
                 actionType={ actionType }/>

       </>
   );
}