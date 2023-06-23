import { useEffect, useRef } from "react";

import { Button, Flex, HStack, Spinner, Text, useToast, UseToastOptions } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";
import { appActions } from "../../../store/slice";
import { useColorValues } from "../../../constant";

interface IToastProps {
   actionMessage: string | undefined;
   actionType: "info" | "error" | "loading";
}

export function Toast( { actionMessage, actionType }: IToastProps ) {
   const { isToastIsClosed } = useAppSelector( state => state.appReducer );

   const toast = useToast();

   const buttonRef = useRef<HTMLButtonElement>( null );

   const dispatch = useAppDispatch();

   useEffect( () => {
      if ( actionMessage?.length ) {
         dispatch( appActions.setIsToastClosed( false ) );
         buttonRef.current?.click();
      }
   }, [ actionMessage ] );

   const { MAIN_COLOR, ALERT_COLOR } = useColorValues();

   useEffect( () => {
      isToastIsClosed && toast.closeAll();
   }, [ isToastIsClosed ] );

   const options: Omit<UseToastOptions, "id"> = {
      render: () => (
          <Flex justifyContent={ "center" }
                alignItems={ "center" }>

             <HStack bg={ actionType === "info" || actionType === "loading" ? MAIN_COLOR : ALERT_COLOR }
                     p={ 3 }
                     w={ "fit-content" }
                     rounded={ 10 }>

                { actionType === "loading"

                    ? <Spinner size={ "sm" }
                               thickness={ "2px" }
                               color={ "white" }/>

                    : <Icon as={ BiBell }
                            color={ "white" }
                            boxSize={ 5 }/>
                }

                <Text fontWeight={ "bold" }
                      color={ "white" }>
                   { actionMessage }
                </Text>

             </HStack>
          </Flex>
      ),
      position: "top",
   };

   const activateToast = () => {
      toast.closeAll();
      toast( options );
   };

   return (
       <Button ref={ buttonRef }
               style={ { display: "none" } }
               onClick={ () => {
                  activateToast();
                  setTimeout( () => {
                     toast.closeAll();
                     dispatch( appActions.setActionMessage( { message: undefined } ) );
                  }, 2000 );
               } }>
       </Button>
   );
}