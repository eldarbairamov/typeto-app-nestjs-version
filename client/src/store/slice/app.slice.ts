import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWhoIsTyping {
   username: string,
   status: boolean
}

interface IInitialState {
   actionMessage: string | undefined;
   actionType: "info" | "error" | "loading";
   isImTyping: boolean;
   whoIsTyping: IWhoIsTyping;
   isToastIsClosed: boolean;
}

const initialState: IInitialState = {
   actionMessage: undefined,
   actionType: "info",
   isImTyping: false,
   whoIsTyping: {} as IWhoIsTyping,
   isToastIsClosed: false
};

export const appSlice = createSlice( {
   name: "app",
   initialState,
   reducers: {

      setActionMessage: ( state, { payload }: PayloadAction<{ message: string | undefined, type?: "info" | "error" | "loading" }> ) => {
         state.actionMessage = payload.message;
         if ( payload.type ) state.actionType = payload.type;
      },

      setIsImTyping: ( state, { payload }: PayloadAction<boolean> ) => {
         state.isImTyping = payload;
      },

      setWhoIsTyping: ( state, { payload }: PayloadAction<IWhoIsTyping> ) => {
         state.whoIsTyping = payload;
      },

      setIsToastClosed: ( state, { payload }: PayloadAction<boolean> ) => {
         state.isToastIsClosed = payload;
      }

   }
} );

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;