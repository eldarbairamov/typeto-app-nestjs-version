import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { ContactModel, UserModel } from "./model";
import { ImageService } from "../common/service/image.service";

@Module( {
   imports: [ SequelizeModule.forFeature( [ UserModel, ContactModel ] ) ],
   controllers: [ UserController ],
   providers: [ UserService, ImageService ]
} )
export class UserModule {

}