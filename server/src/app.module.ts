import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "./user/user.module";
import { dbConfig } from "./config/db-config";
import { MessageModule } from "./message/message.module";
import { ConversationModule } from "./conversation/conversation.module";
import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "node:path";

@Module( {
   imports: [
      ConfigModule.forRoot( {
         isGlobal: true,
         load: [ configuration ],
         envFilePath: ".env"
      } ),
      SequelizeModule.forRoot( dbConfig ),
      ServeStaticModule.forRoot( { rootPath: path.join( process.cwd(), "client" ) } ),
      UserModule,
      MessageModule,
      ConversationModule,
      AuthModule
   ],
} )
export class AppModule {

}