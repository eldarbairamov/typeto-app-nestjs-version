export interface IUser {
   id: number,
   username: string,
   email: string,
   image: string | null
}

export interface IUserBySearch extends IUser {
   isAlreadyAdded: boolean;
}

export interface IUserFromConversation extends IUser {
   ConversationUser: {
      isNewMessageReceived: boolean
   };
}