import { Button, Divider, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, FiUsers } from "react-icons/all";
import { useColorValues } from "../../../constant";

interface IGroupConversationButtonProps {
   isGroup?: boolean;
   createGroupConversation?: () => void;
   openFriendList?: () => void;
   isNoBg?: boolean;
}

export function CreateConversationButton( { createGroupConversation, openFriendList, isGroup, isNoBg }: IGroupConversationButtonProps ) {
   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, FONT_COLOR } = useColorValues();

   return (
       <Button p={ 8 }
               variant={ isNoBg ? "ghost" : "ghost" }
               bg={ isNoBg ? "none" : BUTTON_COLOR }
               _hover={ {
                  bg: isNoBg ? "transparent" : BUTTON_HOVER_COLOR
               } }
               rounded={ 10 }
               gap={ 5 }
               onClick={ isGroup ? createGroupConversation : openFriendList }>

          <Text color={ FONT_COLOR }
                fontSize={ 15 }>
             { isGroup ? "створити групову бесіду?" : "створити бесіду?" }
          </Text>

          <Divider orientation={ "horizontal" }
                   borderColor={ isNoBg ? "gray.600" : "white" }
                   borderWidth={ 1 }
                   h={ 5 }/>

          <Icon as={ isGroup ? FiUsers : AiOutlineMessage }
                boxSize={ 30 }
                cursor={ "pointer" }
                color={ isNoBg ? MAIN_COLOR : "white" }/>

       </Button>
   );
}