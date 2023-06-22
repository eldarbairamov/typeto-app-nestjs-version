import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hook";
import { IUser } from "../../interface";
import { conversationActions, conversationAsyncActions, userActions, userAsyncActions } from "../../store/slice";

export const groupConvMenuService = ( onModalClose: () => void, values: { searchValue: string, groupName: string } ) => {
   const { groupMembers } = useAppSelector( state => state.conversationReducer );

   const dispatch = useAppDispatch();

   const deleteContactFromGroup = ( member: IUser ) => {
      dispatch( conversationActions.deleteContactFromGroup( { id: member.id } ) );
      dispatch( userActions.groupModeMove( { id: member.id, action: "delete", user: member } ) );
   };

   const createGroupConversation = async () => {
      const ids = groupMembers.map( member => member.id );

      const result = await dispatch( conversationAsyncActions.createConversation( { userIds: ids, conversationName: values.groupName } ) );
      if ( conversationAsyncActions.createConversation.fulfilled.match( result ) ) {
         onModalClose && onModalClose();
      }
   };

   useEffect( () => {
      dispatch( userAsyncActions.getContacts( { searchKey: values.searchValue } ) );
   }, [ values.searchValue ] );

   useEffect( () => {
      dispatch( conversationActions.resetGroupMembers() );
   }, [] );

   return { deleteContactFromGroup, createGroupConversation };

};