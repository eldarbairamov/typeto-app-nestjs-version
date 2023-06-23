import React, { useEffect } from "react";

import { TypedOnChange2, TypedSetState } from "../../interface";
import { useAppDispatch, useAppSelector, useDebounce } from "../../hook";
import { appActions, messageAsyncActions } from "../../store/slice";

export const sendMessageService = ( setValue: TypedSetState<string>, value: string ) => {

   const { activeConversation } = useAppSelector( state => state.conversationReducer );

   const debounced = useDebounce( value );

   const dispatch = useAppDispatch();

   const sendMessage = async () => {
      await dispatch( messageAsyncActions.sendMessage( { conversationId: activeConversation.id, content: value } ) );
      setValue( "" );
   };

   useEffect( () => {
      if ( debounced.length >= 0 ) dispatch( appActions.setIsImTyping( false ) );
   }, [ debounced ] );

   useEffect( () => {
      if ( value.length ) dispatch( appActions.setIsImTyping( true ) );
   }, [ value ] );

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
      if ( e.key === "Enter" ) {
         e.preventDefault();

         Boolean( value.charAt( 0 ) !== "\n" ) && await dispatch( messageAsyncActions.sendMessage( {
            conversationId: activeConversation.id,
            content: value
         } ) );

         dispatch( appActions.setIsImTyping( false ) );

         setValue( "" );
      }
   };

   const sendImage = async ( e: TypedOnChange2 ) => {
      const image = (e.target.files as FileList)[0];
      const formData = new FormData();
      formData.append( "image", image );
      formData.append( "conversationId", String( activeConversation.id ) );

      await dispatch( messageAsyncActions.sendImage( { formData, conversationId: activeConversation.id } ) );
   };

   return { sendMessage, onEnterDown, sendImage };

};
