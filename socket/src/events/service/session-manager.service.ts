import { Injectable } from "@nestjs/common";
import { ISocketUser } from "../interface";

@Injectable()
export class SessionManagerService {

   addUser( users: ISocketUser[], userId: number, socketId: string ) {
      if ( !users.some( user => user.userId === userId ) ) users.push( { userId, socketId } );
   }

   removeUser( users: ISocketUser[], socketId: string ) {
      return users.filter( ( user ) => user.socketId !== socketId );
   }

   getUser( users: ISocketUser[], userId: number ) {
      return users.find( ( user ) => user.userId === userId )?.socketId;
   }

   getUsers( users: ISocketUser[], userIds: number[] ) {
      return users
          .map( ( user ) => {
             if ( userIds.includes( user.userId ) ) return user.socketId;
             return null;
          } )
          .filter( item => item !== null );
   };


}