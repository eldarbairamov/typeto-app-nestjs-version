import { UserModel } from "../../user/model";

export const userPresenter = ( document: UserModel ) => {
   return {
      id: document.id,
      username: document.username,
      email: document.email,
      image: document.image
   };
};

export const allUserPresenter = ( documents: UserModel[] ) => {
   return documents.map( doc => userPresenter( doc ) );
};

