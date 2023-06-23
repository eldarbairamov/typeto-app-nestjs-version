import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { chakraTheme } from "./style/chakra.theme.ts";
import { useAppSelector } from "./hook";
import { AuthorizedRouter, UnauthorizedRouter } from "./router";

export function App() {
   const { isLogin } = useAppSelector( state => state.authReducer );

   return (
       <ChakraProvider theme={ chakraTheme }>
          <RouterProvider router={ isLogin ? AuthorizedRouter : UnauthorizedRouter }/>
       </ChakraProvider>
   );
}

