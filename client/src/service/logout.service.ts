import { useAppDispatch } from "../hook";
import { authAsyncActions, socketActions } from "../store/slice";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../router";

export const logoutService = () => {
   const dispatch = useAppDispatch();

   const logout = async () => {
      const result = await dispatch( authAsyncActions.logout() );

      if ( authAsyncActions.logout.fulfilled.match( result ) ) {
         dispatch( socketActions.disconnect() );
         UnauthorizedRouter.navigate( UnauthorizedRoutesEnum.LoginPage );
      }

   };

   return { logout };

};