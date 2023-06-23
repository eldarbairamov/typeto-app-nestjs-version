import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAccessTokenPair, ILoginForm, IRegistrationForm } from "../../interface";
import { authApi, storageApi } from "../../api";
import { errorCatcherFn } from "../../helper";

interface IInitialState {
   isLogin: boolean;
   isLoading: boolean;
   errorMessage: string | undefined;
}

const initialState: IInitialState = {
   isLogin: !!storageApi.getAccessToken(),
   isLoading: false,
   errorMessage: undefined,
};

const login = createAsyncThunk<IAccessTokenPair, { body: ILoginForm }, { rejectValue: string }>(
    "auth/login",
    async ( { body }, { rejectWithValue } ) => {
       try {
          const { data } = await authApi.login(body);
          return data;

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const registration = createAsyncThunk<void, { data: IRegistrationForm }, { rejectValue: string }>(
    "auth/registration",
    async ( { data }, { rejectWithValue } ) => {
       try {
          await authApi.registration(data);

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async ( _, { rejectWithValue } ) => {
       try {
          await authApi.logout();
       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);

const forgotPassword = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
    "auth/forgotPassword",
    async ( { email }, { rejectWithValue } ) => {
       try {
          await authApi.forgotPassword(email);
       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));

       }
    }
);

const resetPassword = createAsyncThunk<void, { resetPasswordToken: string, password: string }, { rejectValue: string }>(
    "auth/resetPassword",
    async ( { resetPasswordToken, password }, { rejectWithValue } ) => {
       try {
          await authApi.resetPassword(resetPasswordToken, password);

       }
       catch (e) {
          return rejectWithValue(errorCatcherFn(e));
       }
    }
);


const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logout: ( state ) => {
         state.isLoading = false;
      }
   },
   extraReducers: builder => builder

       .addCase(login.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(login.fulfilled, ( state, { payload } ) => {
          state.isLoading = false;
          state.isLogin = true;

          storageApi.setTokens({
             accessToken: payload.accessToken,
             refreshToken: payload.refreshToken,
          });

       })

       .addCase(login.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(registration.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(registration.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(registration.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(logout.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(logout.fulfilled, ( state ) => {
          state.isLogin = false;
          state.isLoading = false;
          storageApi.deleteTokens();
       })

       .addCase(logout.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(forgotPassword.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(forgotPassword.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(forgotPassword.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })

       // *************** //

       .addCase(resetPassword.pending, ( state ) => {
          state.isLoading = true;
       })

       .addCase(resetPassword.fulfilled, ( state ) => {
          state.isLoading = false;
       })

       .addCase(resetPassword.rejected, ( state, { payload } ) => {
          state.isLoading = false;
          state.errorMessage = payload;
       })


});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const authAsyncActions = { login, registration, logout, forgotPassword, resetPassword };
