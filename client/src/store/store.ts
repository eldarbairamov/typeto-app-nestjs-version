import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware, toastMiddleware } from "./middleware";
import { appReducer, authReducer, conversationReducer, messageReducer, socketReducer, userReducer } from "./slice";

export const store = configureStore( {
   reducer: {
      authReducer,
      userReducer,
      conversationReducer,
      messageReducer,
      socketReducer,
      appReducer
   },
   middleware: ( gdm ) => gdm().prepend( listenerMiddleware.middleware ).concat( toastMiddleware.middleware )
} );

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
