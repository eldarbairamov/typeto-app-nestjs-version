import { Center, useMediaQuery, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { firstTouchService } from "../../service";
import { Header, Toast } from "../../component";
import { useAppSelector } from "../../hook";

export function AuthorizedLayout() {
   const [ isHeight800 ] = useMediaQuery("(max-height: 800px)");

   const { actionMessage, actionType } = useAppSelector(state => state.appReducer);

   firstTouchService();

   return (
       <Center w={ [ "800px", "100%", "100%", "100%", "100%" ] }
               h={ isHeight800 ? "800px" : "100vh" }>

          <VStack w={ "90%" }
                  h={ "100%" }
                  spacing={ 0 }>

             <Header/>

             <Outlet/>

          </VStack>

          <Toast actionMessage={ actionMessage }
                 actionType={ actionType }/>

       </Center>
   );

}