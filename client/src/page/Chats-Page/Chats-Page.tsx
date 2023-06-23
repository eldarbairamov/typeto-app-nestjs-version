import { calc, HStack, useMediaQuery } from "@chakra-ui/react";
import { ChatBox, EmptyBox, MiniSideBar, SideBar } from "../../component";
import { useAppSelector } from "../../hook";

export function ChatsPage() {
   const { conversations } = useAppSelector( state => state.conversationReducer );

   const [ isWidth1000 ] = useMediaQuery( "(max-width: 1000px)" );

   return (
       <HStack spacing={ 0 }
               w={ "100%" }
               boxShadow={ "xl" }
               rounded={ "20px" }
               h={ calc( "100%" ).subtract( "150px" ).toString() }
               justify={ "space-between" }
               alignItems={ "flex-start" }>

          { isWidth1000 ? <MiniSideBar/> : <SideBar/> }

          { Boolean( !conversations.length ) ? <EmptyBox/> : <ChatBox/> }

       </HStack>
   );
}
