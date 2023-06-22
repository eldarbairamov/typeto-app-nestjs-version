import { ReactNode } from "react";

import { Button, Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { useColorValues } from "../../../constant";

interface IMessagePopover {
   children: ReactNode,
   isOpen: boolean,
   onClose: () => void,
   deleteMessage: () => void
}

export function MessagePopover( { children, isOpen, onClose, deleteMessage }: IMessagePopover ) {
   const { MAIN_COLOR, BG_SECOND, WHITE_COLOR } = useColorValues();

   return (
       <Popover isOpen={ isOpen }
                closeOnBlur={ true }
                onClose={ onClose }>

          <PopoverTrigger>
             { children }
          </PopoverTrigger>

          <PopoverContent _focusVisible={ { outline: "none" } }
                          p={ 1 }
                          bg={ "transparent" }
                          rounded={ 10 }
                          w={ "fit-content" }>

             <PopoverBody bg={ BG_SECOND } rounded={ 5 }>
                <Button variant={ "ghost" }
                        color={ MAIN_COLOR }
                        onClick={ deleteMessage }
                        rounded={ 5 }
                        _active={ { bg: MAIN_COLOR, color: WHITE_COLOR } }
                        _hover={ { bg: MAIN_COLOR, color: WHITE_COLOR } }>
                   видалити повідомлення
                </Button>
             </PopoverBody>

          </PopoverContent>

       </Popover>
   );
}