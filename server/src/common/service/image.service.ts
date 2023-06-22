import path from "node:path";
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "../../user/model";
import process from "process";
import { deleteFileFolder, fileNameMaker, isFolderExists } from "../helper";

@Injectable()
export class ImageService {

   constructor( @InjectModel( UserModel ) private userModel: typeof UserModel ) {
   }

   async process( image: Express.Multer.File, userEmail: string ) {
      const imageName = fileNameMaker( image );
      const imagePath = path.join( process.cwd(), "client", userEmail );

      const isFoldExists = await isFolderExists( imagePath );
      if ( !isFoldExists ) await mkdir( imagePath, { recursive: true } );

      await sharp( image.buffer ).jpeg( { quality: 50 } ).toFile( path.join( imagePath, imageName ) );

      return { imageName };
   }

   async delete( imageName: string, userEmail: string ) {
      const imagePath = path.join( process.cwd(), "client", userEmail, imageName );

      const isFoldExists = await isFolderExists( imagePath );

      isFoldExists && await deleteFileFolder( imagePath );
   }

}
