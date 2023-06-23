import { useEffect } from "react";

import { IConversation } from "../../interface";
import { useAppDispatch } from "../../hook";
import { messageAsyncActions } from "../../store/slice";

export const getMessageService = ( activeConversation: IConversation ) => {

   const dispatch = useAppDispatch();

   const getMessages = async ( conversationId: number ) => dispatch(messageAsyncActions.getMessages({ conversationId }));

   useEffect(() => {
      if (activeConversation?.id) getMessages(activeConversation.id);

   }, [ activeConversation?.id ]);

};