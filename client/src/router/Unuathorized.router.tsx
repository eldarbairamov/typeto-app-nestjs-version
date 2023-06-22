import { createBrowserRouter, Navigate } from "react-router-dom";
import { Error } from "../component";
import { UnauthorizedLayout } from "../layout";
import { ForgotPasswordPage, LoginPage, RegistrationPage, ResetPasswordPage } from "../page";

export const UnauthorizedRouter = createBrowserRouter( [
   {
      path: "/",
      element: <UnauthorizedLayout/>,
      children: [
         {
            index: true,
            element: <LoginPage/>
         },
         {
            path: "login",
            element: <LoginPage/>
         },
         {
            path: "registration",
            element: <RegistrationPage/>
         },
         {
            path: "forgot_password",
            element: <ForgotPasswordPage/>
         },
         {
            path: "reset_password/:token",
            element: <ResetPasswordPage/>
         },
         {
            path: "*",
            element: <Navigate to={ "/" }/>,
         },
      ],
      errorElement: <Error/>
   },
   {
      path: "*",
      element: <Navigate to={ "/" }/>,
   },
] );
