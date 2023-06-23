import { useAppDispatch } from "../../hook";
import { IUser, TypedSetState } from "../../interface";
import { userAsyncActions } from "../../store/slice";

export const addContactService = ( user: IUser, setIsAdded: TypedSetState<boolean> ) => {
   const dispatch = useAppDispatch();

   const addContact = async () => {
      const result = await dispatch( userAsyncActions.addContact( { targetId: user.id } ) );

      if ( userAsyncActions.addContact.fulfilled.match( result ) ) {
         setIsAdded( true );
      }

   };

   return { addContact };

};