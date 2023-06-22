import { useAppDispatch } from "../../hook";
import { userAsyncActions } from "../../store/slice";
import { useEffect } from "react";

export const getContactsService = ( value: string ) => {

   const dispatch = useAppDispatch();

   const getContactsFn = async () => dispatch(userAsyncActions.getContacts({ searchKey: value }));

   useEffect(() => {
      getContactsFn();
   }, [ value ]);

};
