import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActiveConversation, IConversation, IConversationData, IMessage, IUser } from "../../interface";
import { conversationApi } from "../../api";
import { errorCatcherFn } from "../../helper";

interface IInitialState {
   conversations: IConversation[];
   activeConversation: IActiveConversation;
   groupMembers: IUser[];
   isLoading: boolean;
   errorMessage: string | undefined;
   searchKey: string | undefined;
   isNewMessageIncome: boolean;
   count: number;
   limit: number;
   total: number;
}

const initialState: IInitialState = {
   conversations: [] as IConversation[],
   activeConversation: {} as IActiveConversation,
   groupMembers: [] as IUser[],
   isLoading: false,
   errorMessage: undefined,
   searchKey: undefined,
   isNewMessageIncome: false,
   count: 0,
   limit: 30,
   total: 30,
};

const createConversation = createAsyncThunk<IConversation, { userIds: number[], conversationName?: string, username?: string }, {
   rejectValue: string
}>(
    "conversation/createConversation",
    // @ts-ignore
    async ( { userIds, conversationName, username }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationApi.createConversation( userIds, conversationName );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);

const getConversations = createAsyncThunk<IConversationData, { searchKey?: string, limit: number }, { rejectValue: string }>(
    "conversation/getConversations",
    async ( { searchKey, limit }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationApi.getConversations( limit, searchKey );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);

const deleteConversation = createAsyncThunk<IConversationData, { conversation: IConversation, limit: number }, { rejectValue: string }>(
    "conversation/deleteConversation",
    async ( { conversation, limit }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationApi.deleteConversation( conversation.id, limit );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }

    }
);

const kickUserFromGroupConversation = createAsyncThunk<void, { conversationId: number, userId: number }, { rejectValue: string }>(
    "conversation/kickUserFromGroupConversation",
    async ( { conversationId, userId }, { rejectWithValue } ) => {
       try {
          await conversationApi.kickUserFromGroupConversation( conversationId, userId );
       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }
    }
);

const deleteGroupConversation = createAsyncThunk<IConversationData, { conversation: IConversation, limit: number }, { rejectValue: string }>(
    "conversation/deleteGroupConversation",
    async ( { conversation, limit }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationApi.deleteGroupConversation( conversation.id, limit );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }

    }
);

const leaveGroupConversation = createAsyncThunk<IConversationData, { conversation: IConversation, limit: number }, { rejectValue: string }>(
    "conversation/leaveGroupConversation",
    async ( { conversation, limit }, { rejectWithValue } ) => {
       try {
          const { data } = await conversationApi.leaveGroupConversation( conversation.id, limit );
          return data;

       }
       catch ( e ) {
          return rejectWithValue( errorCatcherFn( e ) );
       }

    }
);

const conversationSlice = createSlice( {
   name: "conversation",
   initialState,
   reducers: {

      setSearchKey: ( state, { payload }: PayloadAction<string | undefined> ) => {
         state.searchKey = payload;
      },

      addContactToGroup: ( state, { payload }: PayloadAction<IUser> ) => {
         state.groupMembers.push( payload );
      },

      resetGroupMembers: ( state ) => {
         state.groupMembers = [];
      },

      deleteContactFromGroup: ( state, { payload }: PayloadAction<{ id: number }> ) => {
         state.groupMembers = state.groupMembers.filter( member => member.id !== payload.id );
      },

      setActiveConversation: ( state, { payload }: PayloadAction<IActiveConversation> ) => {
         state.activeConversation = payload;
         state.conversations = state.conversations.map( c => {
            if ( c.id === payload.id ) {
               c.isNewMessagesExist = false;
               return c;
            }
            return c;
         } );
      },

      liftConversation: ( state ) => {
         state.conversations.sort( ( a, b ) => a.lastMessage.lastModified - b.lastMessage.lastModified );
      },

      addConversation: ( state, { payload }: PayloadAction<IConversation> ) => {
         const username = payload.conversationWith && payload.conversationWith[0].username;

         state.conversations.push( payload );
         state.activeConversation = !payload.isGroupConversation ? { ...payload, username: username ? username : undefined } : payload;
         state.conversations.sort( ( a, b ) => b.lastModified - a.lastModified );
      },

      setConversations: ( state, { payload }: PayloadAction<IConversation[]> ) => {
         state.conversations = payload;
         state.activeConversation = state.conversations[0];
      },

      updateConversations: ( state, { payload }: PayloadAction<IConversation> ) => {
         state.conversations = state.conversations.map( c => {
            if ( c.id === payload.id ) {
               return payload;
            }
            return c;
         } );

         if ( state.activeConversation.id === payload.id ) {
            state.activeConversation = payload;
         }

         state.conversations.sort( ( a, b ) => b.lastModified - a.lastModified );
      },

      updateConversationAfterKickUser: ( state, { payload }: PayloadAction<{ whoWasKickedId: number, conversationId: number }> ) => {
         const { whoWasKickedId, conversationId } = payload;
         const target = state.conversations.find( c => c.id === conversationId );
         if ( target ) {
            target.users = target.users.filter( u => u.id !== whoWasKickedId );
            state.activeConversation.users = state.activeConversation.users.filter( u => u.id !== whoWasKickedId );
         }
      },

      deleteConversation: ( state, { payload }: PayloadAction<number> ) => {
         state.conversations = state.conversations.filter( c => c.id !== payload );
         state.activeConversation = state.conversations[0];
      },

      updateConversationAfterDeleteMessage: ( state, { payload }: PayloadAction<{ message: IMessage, conversationId: number }> ) => {
         const target = state.conversations.find( c => c.id === payload.conversationId );
         if ( target ) target.lastMessage = payload.message;
      },

      limitIncrease: ( state ) => {
         if ( state.limit < state.count ) {
            state.limit *= 2;
         }
      }

   },

   extraReducers: builder => builder

       .addCase( createConversation.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( createConversation.fulfilled, ( state, { payload } ) => {
          state.conversations.push( payload );
          state.conversations = state.conversations.sort( ( a, b ) => b.lastModified - a.lastModified );
          state.isLoading = false;
       } )

       .addCase( createConversation.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       } )

       // *************** //

       .addCase( getConversations.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( getConversations.fulfilled, ( state, { payload } ) => {
          state.conversations = payload.data;
          state.isLoading = false;
          state.count = payload.count;
       } )

       .addCase( getConversations.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       } )

       // *************** //

       .addCase( deleteConversation.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( deleteConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload.data;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
          state.count = payload.count;
       } )

       .addCase( deleteConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       } )

       // *************** //

       .addCase( deleteGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( deleteGroupConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload.data;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
          state.count = payload.count;
       } )

       .addCase( deleteGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       } )

       // *************** //

       .addCase( leaveGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( leaveGroupConversation.fulfilled, ( state, { payload } ) => {
          state.conversations = payload.data;
          state.activeConversation = state.conversations[0];
          state.isLoading = false;
          state.count = payload.count;
       } )

       .addCase( leaveGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       } )

       // *************** //

       .addCase( kickUserFromGroupConversation.pending, ( state ) => {
          state.isLoading = true;
       } )

       .addCase( kickUserFromGroupConversation.fulfilled, ( state, { meta } ) => {
          state.isLoading = false;
          state.activeConversation.users = state.activeConversation.users.filter( u => u.id !== meta.arg.userId );
       } )

       .addCase( kickUserFromGroupConversation.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       } )

} );

export const conversationActions = conversationSlice.actions;
export const conversationAsyncActions = {
   getConversations,
   createConversation,
   deleteConversation,
   deleteGroupConversation,
   leaveGroupConversation,
   kickUserFromGroupConversation
};
export const conversationReducer = conversationSlice.reducer;