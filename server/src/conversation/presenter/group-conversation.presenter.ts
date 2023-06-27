import { ConversationAttr, ConversationUserAttr } from "../model";
import { UserModel } from "../../user/model";

export const groupConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {

   return {
      ...conversation,
      isNewMessagesExist: conversation.users
          .map( ( user ) => {

             const userWithAssociation = user as UserModel & {
                ConversationUserModel: ConversationUserAttr
             };

             if ( userWithAssociation.id === userId ) return userWithAssociation.ConversationUserModel.isNewMessagesExist;

             return null;

          } )
          .filter( res => res !== null )[0],
      lastMessage: conversation.lastMessage
   };

};