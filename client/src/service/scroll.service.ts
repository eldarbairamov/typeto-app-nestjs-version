import { useEffect, useRef, useState } from "react";

import { IMessage } from "../interface";
import { useAppDispatch } from "../hook";
import { messageActions } from "../store/slice";

export const scrollService = ( isNewMessageAdded: boolean, prevMessagesLength: number, messages: IMessage[], onClose: () => void, onOpen: () => void ) => {

   const messageListRef = useRef<HTMLDivElement>( null );

   const [ isBlindZone, setIsBlindZone ] = useState<boolean>( false );

   const dispatch = useAppDispatch();

   const scrollHandler = () => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;
      const scrollT = messageListRef.current?.scrollTop as number;

      if ( (scrollH - clientH - 500) > scrollT ) {
         setIsBlindZone( true );
         dispatch( messageActions.resetIsNewMessageAdded() );
      }

      if ( (Math.ceil( scrollT ) === (scrollH - clientH)) ) {
         setIsBlindZone( false );
         dispatch( messageActions.resetMessagesLength() );
      }
   };

   const scrollToBottom = () => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;

      messageListRef.current?.scrollTo( { behavior: "smooth", top: scrollH - clientH } );
      onClose();
      dispatch( messageActions.resetMessagesLength() );
   };

   useEffect( () => {
      if ( (messages.length > prevMessagesLength) && isBlindZone && !isNewMessageAdded ) {
         onOpen();
      }

      if ( !isBlindZone ) onClose();

   }, [ messages, prevMessagesLength, isBlindZone, isNewMessageAdded ] );

   useEffect( () => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;

      if ( !isBlindZone || isNewMessageAdded ) messageListRef.current?.scrollTo( { behavior: "auto", top: scrollH - clientH } );

   }, [ scrollHandler, isBlindZone ] );

   useEffect( () => {
      const scrollListener = messageListRef.current?.addEventListener( "scroll", scrollHandler );
      return () => removeEventListener( "scroll", scrollListener! );
   } );

   return { messageListRef, scrollToBottom };

};