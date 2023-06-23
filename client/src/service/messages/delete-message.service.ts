import { useAppDispatch } from "../../hook";
import { IMessage } from "../../interface";
import { messageAsyncActions } from "../../store/slice";

export const deleteMessageService = ( message: IMessage ) => {
   const dispatch = useAppDispatch();

   const deleteMessage = async () => dispatch( messageAsyncActions.deleteMessage( {
      messageId: message.id,
      conversationId: message.conversationId
   } ) );

   return { deleteMessage };
};