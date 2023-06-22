import { userAsyncActions } from "../store/slice";
import { useAppDispatch } from "../hook";

export const findUserService = ( value: string ) => {
   const dispatch = useAppDispatch();

   const findUser = async () => {
      if ( value !== "" ) {
         await dispatch( userAsyncActions.findUser( { userEmail: value } ) );
      }
   };

   return { findUser };
};