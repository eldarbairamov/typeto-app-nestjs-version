import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../interface";
import { messageApi } from "../../api";
import { errorCatcherFn } from "../../helper";

interface IInitialState {
   messages: IMessage[];
   prevMessagesLength: number;
   isMessagesLoading: boolean;
   isMessageSending: boolean;
   isImageSending: boolean;
   errorMessage: string | undefined;
   isNewMessageAdded: boolean;
}

const initialState: IInitialState = {
   messages: [] as IMessage[],
   prevMessagesLength: 0,
   isMessagesLoading: false,
   isMessageSending: false,
   isImageSending: false,
   errorMessage: undefined,
   isNewMessageAdded: false,
};

const getMessages = createAsyncThunk<IMessage[], { conversationId: number }, { rejectValue: string }>(
    "message/getMessages",
    async ( { conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageApi.getMessages( conversationId );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }

    } );

const sendMessage = createAsyncThunk<IMessage, { content: string, conversationId: number }, { rejectValue: string }>(
    "message/sendMessage",
    async ( { content, conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageApi.sendMessage( conversationId, content );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);

const deleteMessage = createAsyncThunk<IMessage, { messageId: number, conversationId: number }, { rejectValue: string }>(
    "message/deleteMessage",
    async ( { messageId, conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageApi.deleteMessage( messageId, conversationId );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);

const sendImage = createAsyncThunk<IMessage, { formData: FormData, conversationId: number }, { rejectValue: string }>(
    "message/sendImage",
    async ( { formData, conversationId }, { rejectWithValue } ) => {
       try {
          const { data } = await messageApi.sendImage( formData, conversationId );
          return data;
       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);


const messageSlice = createSlice( {
   name: "message",
   initialState,
   reducers: {

      addMessage: ( state, { payload }: PayloadAction<IMessage> ) => {
         state.messages.push( payload );
      },

      resetMessages: ( state ) => {
         state.messages = [];
      },

      deleteMessage: ( state, { payload }: PayloadAction<number> ) => {
         const target = state.messages.find( m => m.id === payload );
         const targetIndex = state.messages.indexOf( target! );
         state.messages.splice( targetIndex, 1 );
      },

      resetMessagesLength: ( state ) => {
         state.prevMessagesLength = state.messages.length;
      },

      resetIsNewMessageAdded: ( state ) => {
         state.isNewMessageAdded = false;
      }

   },
   extraReducers: ( builder ) => builder

       .addCase( getMessages.pending, ( state ) => {
          state.isMessagesLoading = true;
       } )
       .addCase( getMessages.fulfilled, ( state, { payload } ) => {
          state.messages = payload;
          state.isMessagesLoading = false;
          state.prevMessagesLength = payload.length;
       } )
       .addCase( getMessages.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isMessagesLoading = false;
       } )

       // *************** //

       .addCase( sendMessage.pending, ( state ) => {
          state.isMessageSending = true;
       } )

       .addCase( sendMessage.fulfilled, ( state, { payload } ) => {
          state.isNewMessageAdded = true;
          state.isMessageSending = false;
          state.messages.push( payload );
          state.prevMessagesLength = state.messages.length;
       } )

       .addCase( sendMessage.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isMessageSending = false;
       } )

       // *************** //

       .addCase( sendImage.pending, ( state ) => {
          state.isImageSending = true;
       } )

       .addCase( sendImage.fulfilled, ( state, { payload } ) => {
          state.isImageSending = false;
          state.messages.push( payload );
       } )

       .addCase( sendImage.rejected, ( state, { payload } ) => {
          state.isImageSending = false;
          state.errorMessage = payload;
       } )

       // *************** //

       .addCase( deleteMessage.pending, ( state ) => {
          state.isNewMessageAdded = false;
       } )

       .addCase( deleteMessage.fulfilled, ( state, { meta } ) => {
          const target = state.messages.find( m => m.id === meta.arg.messageId );
          const targetIndex = state.messages.indexOf( target! );
          state.messages.splice( targetIndex, 1 );
       } )


} );

export const messageAsyncActions = { getMessages, sendMessage, sendImage, deleteMessage };
export const messageActions = messageSlice.actions;
export const messageReducer = messageSlice.reducer;