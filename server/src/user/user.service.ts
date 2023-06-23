import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ContactModel, UserModel } from "./model";
import { ImageService } from "../common/service";

@Injectable()
export class UserService {
   constructor(
       @InjectModel( UserModel ) private userModel: typeof UserModel,
       @InjectModel( ContactModel ) private contactModel: typeof ContactModel,
       private imageService: ImageService
   ) {
   }

   async findUser( userEmail: string, currentUserId: number ): Promise<any> {
      const [ user, isAlreadyAdded ] = await Promise.all( [
         this.userModel.findOne( {
            where: {
               email: userEmail
            },
            attributes: [ "id", "username", "email", "image" ]
         } )
             .then( res => res?.dataValues ),
         this.userModel.findByPk( currentUserId, {
            include: "contacts"
         } )
             .then( user => user?.contacts.find( c => c.email === userEmail ) )
      ] );

      if ( !user ) throw new HttpException( "User is not found", HttpStatus.NOT_FOUND );

      return { ...user, isAlreadyAdded: Boolean( isAlreadyAdded ) };
   }

   async getCurrentUser( currentUserId: number ): Promise<UserModel> {
      return await this.userModel.findByPk( currentUserId, {
         attributes: [ "id", "username", "email", "image" ]
      } );
   }

   async uploadAvatar( file: Express.Multer.File, currentUserId: number ): Promise<{ imageName: string }> {
      const user = await this.userModel.findByPk( currentUserId );

      user.image && await this.imageService.delete( user.image, user.email );

      const { imageName } = await this.imageService.process( file, user.email );

      await user?.update( { image: imageName }, { hooks: false } );

      return { imageName };
   }

   async deleteAvatar( currentUserId: number ): Promise<void> {
      const user = await this.userModel.findByPk( currentUserId );

      await this.imageService.delete( user.image, user.email );

      await user?.update( { image: null }, { hooks: false } );
   }

   async getContacts( searchKey: string, currentUserId: number ): Promise<UserModel[]> {
      return await this.userModel.findOne( {
         where: {
            id: currentUserId
         },
         include: {
            association: "contacts",
            attributes: [ "id", "username", "email", "image" ]
         },
      } )
          .then( user => {
             const contacts = user?.contacts;
             return searchKey ? contacts?.filter( c => c.username.match( searchKey ) ) : contacts;
          } );
   }

   async addContact( targetId: number, currentUserId: number ): Promise<void> {
      await this.contactModel.create( {
         userId: currentUserId!,
         contactId: targetId
      } );
   }

   async deleteContact( contactId: number, currentUserId: number ): Promise<UserModel[]> {
      await this.contactModel.destroy( {
         where: {
            userId: currentUserId,
            contactId
         }
      } );

      return await this.userModel.findOne( {
         where: {
            id: 1
         },
         include: {
            association: "contacts",
            attributes: [ "id", "username", "email", "image" ]
         },
      } )
          .then( user => user?.contacts );
   }


}