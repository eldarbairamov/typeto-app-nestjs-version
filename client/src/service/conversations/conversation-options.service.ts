import { conversationAsyncActions } from "../../store/slice";
import { useAppDispatch, useAppSelector } from "../../hook";
import { IConversation } from "../../interface";

export const conversationOptionsService = ( activeConversation: IConversation ) => {
   const { limit } = useAppSelector( state => state.conversationReducer );

   const dispatch = useAppDispatch();

   const deleteConversation = async () => dispatch( conversationAsyncActions.deleteConversation( {
      conversation: activeConversation,
      limit
   } ) );

   const leaveGroupConversation = async () => dispatch( conversationAsyncActions.leaveGroupConversation( {
      conversation: activeConversation,
      limit
   } ) );

   const deleteGroupConversation = async () => dispatch( conversationAsyncActions.deleteGroupConversation( {
      conversation: activeConversation,
      limit
   } ) );

   return { deleteConversation, leaveGroupConversation, deleteGroupConversation };

};
