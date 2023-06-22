import { createBrowserRouter } from "react-router-dom";
import { Error } from "../component";
import { AuthorizedLayout } from "../layout";
import { ChatsPage } from "../page";
import { UnauthorizedPage } from "../page/Unauthorized-Page/Unauthorized-Page.tsx";

export const AuthorizedRouter = createBrowserRouter([
   {
      path: "/",
      element: <AuthorizedLayout/>,
      children: [
         {
            index: true,
            element: <ChatsPage/>
         },
      ],
      errorElement: <Error/>
   },
   {
      path: "/unauthorized",
      element: <UnauthorizedPage/>,
      errorElement: <Error/>
   }
]);
