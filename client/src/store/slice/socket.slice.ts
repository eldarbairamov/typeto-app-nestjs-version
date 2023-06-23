import { createSlice } from "@reduxjs/toolkit";
import { ConnectionType } from "../../type/socket.type.ts";

interface IInitialState {
   connect: ConnectionType;
}

const initialState: IInitialState = {
   connect: ConnectionType.Disconnect
};

export const socketSlice = createSlice( {
   name: "socket",
   initialState,
   reducers: {

      connect: ( state ) => {
         state.connect = ConnectionType.Connect;
      },

      disconnect: ( state ) => {
         state.connect = ConnectionType.Disconnect;
      }

   }
} );

export const socketActions = socketSlice.actions;
export const socketReducer = socketSlice.reducer;