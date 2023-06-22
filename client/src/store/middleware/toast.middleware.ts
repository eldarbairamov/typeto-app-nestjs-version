import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { appActions, authAsyncActions, conversationAsyncActions, messageAsyncActions, userAsyncActions } from "../slice";

export const toastMiddleware = createListenerMiddleware();

toastMiddleware.startListening( {
   matcher: isAnyOf(
       authAsyncActions.login.rejected,
       authAsyncActions.registration.rejected,
       authAsyncActions.logout.rejected,
       authAsyncActions.forgotPassword.rejected,
       userAsyncActions.getContacts.rejected,
       userAsyncActions.addContact.rejected,
       userAsyncActions.getCurrentUser.rejected,
       conversationAsyncActions.getConversations.rejected,
       conversationAsyncActions.deleteConversation.rejected,
       conversationAsyncActions.leaveGroupConversation.rejected,
       conversationAsyncActions.deleteGroupConversation.rejected,
       messageAsyncActions.deleteMessage.rejected,
       messageAsyncActions.getMessages.rejected,
       messageAsyncActions.sendMessage.rejected,
       userAsyncActions.uploadAvatar.rejected,
       userAsyncActions.deleteAvatar.rejected,
       userAsyncActions.findUser.rejected,
       authAsyncActions.logout.rejected,
   ),
   effect: ( action, api ) => {
      const dispatch = api.dispatch;

      const message = action.payload;

      dispatch( appActions.setActionMessage( { message: message, type: "error" } ) );
   }
} );

toastMiddleware.startListening( {
   matcher: isAnyOf(
       userAsyncActions.uploadAvatar.pending,
       userAsyncActions.deleteAvatar.pending,
       authAsyncActions.logout.pending,
   ),
   effect: ( _, api ) => {
      const dispatch = api.dispatch;

      dispatch( appActions.setActionMessage( { message: "зачекайте...", type: "loading" } ) );
   }
} );

toastMiddleware.startListening( {
   matcher: isAnyOf(
       userAsyncActions.uploadAvatar.fulfilled,
       userAsyncActions.deleteAvatar.fulfilled,
       authAsyncActions.logout.fulfilled,
   ),
   effect: ( _, api ) => {
      const dispatch = api.dispatch;

      dispatch( appActions.setIsToastClosed( true ) );
   }
} );