import { IUser } from "../../interface";
import { useAppDispatch, useAppSelector } from "../../hook";
import { conversationActions, conversationAsyncActions } from "../../store/slice";

export const createConversationService = ( user: IUser, onModalClose?: () => void ) => {
   const { conversations } = useAppSelector( state => state.conversationReducer );

   const dispatch = useAppDispatch();

   const createConversation = async () => {

      const isConversationExists = conversations.find( c => {
         if ( !c.isGroupConversation ) {
            const targetId = c.conversationWith[0]?.id;
            if ( user.id === targetId ) return c;
         }
      } );

      if ( isConversationExists ) {
         dispatch( conversationActions.setActiveConversation( isConversationExists ) );
         onModalClose && onModalClose();
      }
      else {
         const result = await dispatch( conversationAsyncActions.createConversation( {
            userIds: [ user.id ],
            username: user.username
         } ) );

         if ( conversationAsyncActions.createConversation.fulfilled.match( result ) ) {
            onModalClose && onModalClose();
         }
      }

   };

   return { createConversation };

};