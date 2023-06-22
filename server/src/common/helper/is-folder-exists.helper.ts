import { access } from "fs/promises";

export const isFolderExists = async ( path: string ) => {
   try {
      await access( path );
      return true;
   }
   catch {
      return false;
   }
};