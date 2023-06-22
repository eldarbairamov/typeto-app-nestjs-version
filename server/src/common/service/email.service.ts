import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { emailTemplate } from "../email-template/email-template";
import path from "node:path";
import { IEnvironment } from "../interface/env.inteface";
import { EmailActionType } from "../type/email-action.type";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { EMAIL_TEMPLATES_PATH } from "../constant";

@Injectable()
export class EmailService {

   constructor( private configService: ConfigService<IEnvironment> ) {
   }

   async send( to: string, emailAction: EmailActionType, context: any ) {
      const template = emailTemplate[emailAction];

      const transporter = nodemailer.createTransport( {
         service: "gmail",
         from: "no reply",
         auth: {
            user: this.configService.get( "EMAIL_SERVICE_USER" ),
            pass: this.configService.get( "EMAIL_SERVICE_PASS" ),
         },
      } );

      transporter.use( "compile", hbs( {
         viewEngine: {
            defaultLayout: "main",
            layoutsDir: path.join( EMAIL_TEMPLATES_PATH, "layout" ),
            partialsDir: path.join( EMAIL_TEMPLATES_PATH, "partial" ),
            extname: ".hbs",
         },
         extName: ".hbs",
         viewPath: path.join( EMAIL_TEMPLATES_PATH, "view" ),
      } ) );

      const mail = {
         to,
         subject: template.subject,
         template: template.templateName,
         context,
      };

      return transporter
          .sendMail( mail )
          .catch( ( e ) => {
             console.log( e );
             throw new HttpException( "Nodemailer: Error", HttpStatus.INTERNAL_SERVER_ERROR );
          } );

   };
}