import { Middleware } from "@reduxjs/toolkit";

export const loggerMiddleware: Middleware = ( store ) => ( next ) => ( action ) => {

   console.log("Dispatching:", action);
   const result = next(action);

   console.log("Next state:", store.getState());
   return result;

};