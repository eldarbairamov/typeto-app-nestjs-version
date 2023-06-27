import { ConversationAttr, ConversationUserAttr, UserModel } from "../model";

export const privateConversationPresenter = ( conversation: ConversationAttr, userId: number ) => {
   const { users, ...presentedConversation } = Object.assign(
       {},
       { ...conversation },
       {
          conversationWith: conversation.users.filter( user => user.id !== userId )
       },
       {
          isNewMessagesExist: conversation.users
              .map( ( user ) => {
                 const userWithAssociation = user as UserModel & { ConversationUserModel: ConversationUserAttr };

                 if ( userWithAssociation.id === userId ) {
                    return userWithAssociation.ConversationUserModel.isNewMessagesExist;
                 }

                 return null;
              } )
              .filter( user => user !== null )[0]
       },
       {
          lastMessage: conversation.lastMessage
       }
   );

   return presentedConversation;
};