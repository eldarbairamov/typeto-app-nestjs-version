import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserBySearch } from "../../interface";
import { userApi } from "../../api";
import { errorCatcherFn } from "../../helper";

interface IInitialState {
   contacts: IUser[];
   userBySearch: IUserBySearch;
   isLoading: boolean;
   errorMessage: string | undefined;
   onlineContactsIds: number[];
   currentUserInfo: IUser;
}

const initialState: IInitialState = {
   contacts: [] as IUser[],
   userBySearch: {} as IUserBySearch,
   isLoading: false,
   errorMessage: undefined,
   onlineContactsIds: [] as number[],
   currentUserInfo: {} as IUser
};

const getContacts = createAsyncThunk<IUser[], { searchKey?: string }, { rejectValue: string }>(
    "user/getContacts",
    async ( { searchKey }, { rejectWithValue } ) => {
       try {
          const { data } = await userApi.getContacts(searchKey);
          return data;

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const addContact = createAsyncThunk<void, { targetId: number }, { rejectValue: string }>(
    "user/addContact",
    async ( { targetId }, { rejectWithValue } ) => {
       try {
          await userApi.addContact(targetId);

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const findUser = createAsyncThunk<IUserBySearch, { userEmail: string }, { rejectValue: string }>(
    "user/findUser",
    async ( { userEmail }, { rejectWithValue } ) => {
       try {
          const { data } = await userApi.findUser(userEmail);
          return data;

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }

    }
);

const uploadAvatar = createAsyncThunk<{ imageName: string }, FormData, { rejectValue: string }>(
    "user/uploadAvatar",
    async ( formData, { rejectWithValue } ) => {
       try {
          const { data } = await userApi.uploadAvatar(formData);
          return data;
       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const deleteAvatar = createAsyncThunk<void, void, { rejectValue: string }>(
    "user/deleteAvatar",
    async ( _, { rejectWithValue } ) => {
       try {
          await userApi.deleteAvatar();
       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);


const deleteContact = createAsyncThunk<IUser[], { contactId: number }, { rejectValue: string }>(
    "user/deleteContact",
    async ( { contactId }, { rejectWithValue } ) => {
       try {
          const { data } = await userApi.deleteContact(contactId);
          return data;

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const getCurrentUser = createAsyncThunk<IUser, void, { rejectValue: string }>(
    "user/getCurrentUser",
    async ( _, { rejectWithValue } ) => {
       try {
          const { data } = await userApi.getCurrentUser();
          return data;

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {

      setUser: ( state, { payload }: PayloadAction<IUserBySearch> ) => {
         state.userBySearch = payload;
      },

      groupModeMove: ( state, { payload }: PayloadAction<{ id: number, action: "delete" | "add", user?: IUser }> ) => {
         if (payload.action === "delete" && payload.user) state.contacts.push(payload.user);
         if (payload.action === "add") state.contacts = state.contacts.filter(contact => contact.id !== payload.id);
      },

      setOnlineContacts: ( state, { payload }: PayloadAction<number[]> ) => {
         state.onlineContactsIds = payload;
      },

   },

   extraReducers: builder => builder

       .addCase(getContacts.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(getContacts.fulfilled, ( state, { payload } ) => {
          state.contacts = payload;
          state.isLoading = false;
       })

       .addCase(getContacts.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(findUser.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(findUser.fulfilled, ( state, { payload } ) => {
          state.userBySearch = payload;
          state.isLoading = false;
       })

       .addCase(findUser.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(deleteContact.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(deleteContact.fulfilled, ( state, { payload } ) => {
          state.contacts = payload;
          state.isLoading = false;
       })

       .addCase(deleteContact.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(addContact.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(addContact.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(addContact.rejected, ( state, { payload } ) => {
          state.errorMessage = payload;
          state.isLoading = false;
       })

       // *************** //

       .addCase(uploadAvatar.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(uploadAvatar.fulfilled, ( state, { payload } ) => {
          state.isLoading = false;
          state.currentUserInfo.image = payload.imageName;
       })

       .addCase(uploadAvatar.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(getCurrentUser.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(getCurrentUser.fulfilled, ( state, { payload } ) => {
          state.isLoading = false;
          state.currentUserInfo = payload;
       })

       .addCase(getCurrentUser.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(deleteAvatar.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(deleteAvatar.fulfilled, ( state ) => {
          state.isLoading = false;
          state.currentUserInfo.image = null;
       })

       .addCase(deleteAvatar.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

});

export const userActions = userSlice.actions;
export const userAsyncActions = { getContacts, findUser, addContact, deleteContact, uploadAvatar, getCurrentUser, deleteAvatar };
export const userReducer = userSlice.reducer;
