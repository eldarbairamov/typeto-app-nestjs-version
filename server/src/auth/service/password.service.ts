import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class PasswordService {

   async passComparer( dry: string, hashed: string ) {
      try {
         return await bcrypt.compare( dry, hashed );
      }
      catch ( e ) {
         throw new HttpException( "Bcrypt: Compare error", HttpStatus.INTERNAL_SERVER_ERROR );
      }
   }

   async passHasher( dry: string ) {
      try {
         return await bcrypt.hash( dry, 8 );
      }
      catch ( e ) {
         throw new HttpException( "Bcrypt: Hash error", HttpStatus.INTERNAL_SERVER_ERROR );
      }
   }

}