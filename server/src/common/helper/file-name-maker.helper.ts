import path from "node:path";

export const fileNameMaker = ( image: Express.Multer.File ) => {
   const ext = path.extname( image.originalname );
   return Date.now() + ext;
};