import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { appActions, authAsyncActions, conversationActions, conversationAsyncActions, messageActions, messageAsyncActions, socketActions, userActions, userAsyncActions } from "../slice";
import { io, Socket } from "socket.io-client";
import { IConversation, IMessage, IUserFromConversation } from "../../interface";
import { GREEN_COLOR, MAGENTA } from "../../constant";

let socket: Socket;

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
   actionCreator: authAsyncActions.logout.fulfilled,
   effect: () => {
      socket.disconnect();
   }
});

listenerMiddleware.startListening({
   actionCreator: userAsyncActions.getCurrentUser.fulfilled,
   effect: ( _, api ) => {

      console.log(GREEN_COLOR, "get current user");

      const { userReducer } = api.getState() as RootState;

      socket.emit("add_user", userReducer.currentUserInfo.id);

   }
});

listenerMiddleware.startListening({
   actionCreator: socketActions.connect,
   effect: async ( _, api ) => {

      console.log(GREEN_COLOR, "socket connection");

      const dispatch = api.dispatch;

      socket = io("ws://localhost:3200");

      socket.connect();

      socket.on("who_is_online", ( userIds: number[] ) => {
         console.log(MAGENTA, "socket: who_is_online");
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on("refresh_online_users", ( userIds: number[] ) => {
         console.log(MAGENTA, "socket: refresh_online_users");
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on("get_conversation", ( conversation: IConversation ) => {
         console.log(MAGENTA, "socket: get_conversation");
         dispatch(conversationActions.addConversation(conversation));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.setActiveConversation,
   effect: async ( action, api ) => {

      console.log(GREEN_COLOR, "set active conversation");

      const { userReducer, conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const currentUserId = userReducer.currentUserInfo.id;

      const activeConversationId = conversationReducer.activeConversation.id;

      socket.emit("join_to_conversation", action.payload.id);

      socket.off("get_message");

      socket.on("get_message", ( message: IMessage, conversationForSender: IConversation, conversationForReceiver: IConversation ) => {
         console.log(MAGENTA, "socket: get_message");

         const senderId = message.senderId;
         const conversationId = message.conversationId;

         if (senderId === currentUserId && activeConversationId === conversationId) {
            conversationForSender.isNewMessagesExist = false;
            dispatch(conversationActions.updateConversations(conversationForSender));
         }

         if (senderId !== currentUserId && activeConversationId === conversationId) {
            conversationForReceiver.isNewMessagesExist = false;
            dispatch(messageActions.addMessage(message));
            dispatch(conversationActions.updateConversations(conversationForReceiver));
         }

         if (senderId === currentUserId && activeConversationId !== conversationId) {
            dispatch(conversationActions.updateConversations(conversationForSender));
         }

         if (senderId !== currentUserId && activeConversationId !== conversationId) {
            dispatch(conversationActions.updateConversations(conversationForReceiver));
         }

      });

      socket.on("someone_is_typing", ( conversationId: number, whoIsTyping: string ) => {
         console.log(MAGENTA, "socket: someone_is_typing");

         if (activeConversationId === conversationId) {
            dispatch(appActions.setWhoIsTyping({ status: true, username: whoIsTyping }));
         }
      });

      socket.on("someone_is_stop_typing", ( conversationId: number, whoIsTyping: string ) => {
         console.log(MAGENTA, "socket: someone_is_stop_typing");

         if (activeConversationId === conversationId) {
            dispatch(appActions.setWhoIsTyping({ status: false, username: whoIsTyping }));
         }
      });

   },
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.getConversations.fulfilled,
   effect: async ( _, api ) => {

      console.log(GREEN_COLOR, "get conversations");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      if (conversationReducer.conversations.length) {
         dispatch(conversationActions.setActiveConversation(conversationReducer.conversations[0]));
      }

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         console.log(MAGENTA, "socket: get_leave_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeft } покинув(ла) бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.updateConversations(conversation));
      });

      socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
         console.log("socket: get_delete_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeave } закінчив(ла) бесіду `,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         console.log(MAGENTA, "socket: get_delete_group_result");
         dispatch(appActions.setActionMessage({
            message: `Адмін ${ adminName } закрив бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("delete_message_result", ( messageId: number, conversationId: number, updatedLastMessage: IMessage ) => {
         console.log(MAGENTA, "socket: delete_message_result");
         dispatch(messageActions.deleteMessage(messageId));
         dispatch(conversationActions.updateConversationAfterDeleteMessage({ message: updatedLastMessage, conversationId }));
      });

      socket.on("kick_user_result", ( whoWasKickedId: number, conversationId: number ) => {
         console.log(MAGENTA, "socket: kick_user_result");
         dispatch(conversationActions.updateConversationAfterKickUser({ whoWasKickedId, conversationId }));
      });

      socket.on("i_was_kicked", ( message: string, conversationId: number ) => {
         console.log(MAGENTA, "socket: i_was_kicked");
         dispatch(appActions.setActionMessage({ message, type: "info" }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.addConversation,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "add conversation");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      if (conversationReducer.conversations.length) {
         dispatch(conversationActions.setActiveConversation(action.payload));
      }

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         console.log(MAGENTA, "socket: get_leave_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeft } покинув(ла) бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.updateConversations(conversation));
      });

      socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
         console.log(MAGENTA, "socket: get_delete_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeave } закінчив(ла) бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         console.log(MAGENTA, "socket: get_delete_group_result");
         dispatch(appActions.setActionMessage({
            message: `Адмін ${ adminName } закрив бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.createConversation.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "create conversation");

      const { userReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const userIds = action.meta.arg.userIds;
      const conversationWith = userIds.length ? userIds : userIds[0];

      socket.emit("create_conversation", action.payload.id, userReducer.currentUserInfo.id, conversationWith);

      dispatch(conversationActions.setActiveConversation(action.payload));

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         console.log(MAGENTA, "socket: get_leave_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeft } покинув(ла) бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.updateConversations(conversation));
      });

      socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
         console.log(MAGENTA, "socket: get_delete_result");
         dispatch(appActions.setActionMessage({
            message: `${ whoLeave } закінчив(ла) бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         console.log(MAGENTA, "socket: get_delete_group_result");
         dispatch(appActions.setActionMessage({
            message: `Адмін ${ adminName } закрив бесіду`,
            type: "info"
         }));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteConversation.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "delete conversation");

      const { userReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      dispatch(messageActions.resetMessages());

      const conversationWith = action.meta.arg.conversation.conversationWith[0].id;
      const conversationId = action.meta.arg.conversation.id;
      socket.emit("delete_conversation", conversationId, conversationWith, { id: userReducer.currentUserInfo.id, username: userReducer.currentUserInfo.username });
   },
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteGroupConversation.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "delete group conversation");

      const { userReducer } = api.getState() as RootState;

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== userReducer.currentUserInfo.id) return u.id;
             return null;
          })
          .filter(id => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("delete_group_conversation", conversationWith, conversationId, userReducer.currentUserInfo.username);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.leaveGroupConversation.fulfilled,
   effect: ( action, api ) => {
      const { userReducer } = api.getState() as RootState;

      console.log(GREEN_COLOR, "leave group conversation");

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== userReducer.currentUserInfo.id) return u.id;
             return null;
          })
          .filter(( id ) => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("leave_group_conversation", conversationId, conversationWith, userReducer.currentUserInfo.username);
   }
});

listenerMiddleware.startListening({
   actionCreator: messageAsyncActions.getMessages.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "get messages");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const conversationId = action.meta.arg.conversationId;

      if (conversationReducer.activeConversation.id === conversationId) {
         const updatedConversation = JSON.parse(JSON.stringify(conversationReducer.conversations.find(c => c.id === conversationId)));
         updatedConversation.isNewMessagesExist = false;

         dispatch(conversationActions.updateConversations(updatedConversation));
      }
   }
});

listenerMiddleware.startListening({
   matcher: isAnyOf(messageAsyncActions.sendImage.fulfilled, messageAsyncActions.sendMessage.fulfilled),
   effect: ( action ) => {

      console.log(GREEN_COLOR, "send message / send image");

      socket.emit("send_message", action.payload);
   }
});

listenerMiddleware.startListening({
   actionCreator: messageAsyncActions.deleteMessage.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "delete message");

      const dispatch = api.dispatch;

      const { userReducer } = api.getState() as RootState;

      const { messageId, conversationId } = action.meta.arg;

      const currentUserId = userReducer.currentUserInfo.id;

      dispatch(conversationActions.updateConversationAfterDeleteMessage({ message: action.payload, conversationId }));

      socket.emit("delete_message", messageId, conversationId, currentUserId);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.kickUserFromGroupConversation.fulfilled,
   effect: ( action, api ) => {

      console.log(GREEN_COLOR, "kick user from conversation");

      const { userReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const { conversationId, userId } = action.meta.arg;

      dispatch(conversationActions.updateConversationAfterKickUser({ whoWasKickedId: userId, conversationId }));

      socket.emit("kick_user_from_group_conversation", conversationId, userId, userReducer.currentUserInfo.id);
   }
});

listenerMiddleware.startListening({
   actionCreator: appActions.setIsImTyping,
   effect: ( action, api ) => {

      const { conversationReducer, userReducer } = api.getState() as RootState;

      const activeConversation = conversationReducer.activeConversation;
      const { currentUserInfo } = userReducer;

      const isImTyping = action.payload;

      if (isImTyping) {
         socket.emit("typing", activeConversation.id, currentUserInfo.id);
      }

      if (!isImTyping) {
         socket.emit("stop_typing", activeConversation.id, currentUserInfo.id);
      }
   }
});
