import { ConversationAttr, ConversationUserAttr, UserModel } from "../model";

export const groupConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {

   return {
      ...conversation,
      isNewMessagesExist: conversation.users
          .map( ( user ) => {

             const userWithAssociation = user as UserModel & {
                ConversationUser: ConversationUserAttr
             };

             if ( userWithAssociation.id === userId ) return userWithAssociation.ConversationUser?.isNewMessagesExist;

             return null;

          } )
          .filter( res => res !== null )[0],
      lastMessage: conversation.lastMessage
   }

};