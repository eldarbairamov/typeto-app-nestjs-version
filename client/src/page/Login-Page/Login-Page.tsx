import { LoginForm, Logo } from "../../component";
import { Center } from "@chakra-ui/react";
import { useColorValues } from "../../constant";

export function LoginPage() {
   const { MAIN_COLOR } = useColorValues();

   return (
       <Center h={ "100vh" }
               gap={ 100 }
               flexDirection={ { base: "column", md: "row" } }>

          <Logo color={ MAIN_COLOR }/>

          <LoginForm/>

       </Center>
   );
}
