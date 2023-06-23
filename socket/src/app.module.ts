import { Module } from "@nestjs/common";
import { EventsModule } from "./events/events.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/";
import { SequelizeModule } from "@nestjs/sequelize";
import { dbConfig } from "./config/db-config";

@Module( {
   imports: [
      ConfigModule.forRoot( {
         envFilePath: ".env",
         load: [ configuration ],
         isGlobal: true,
      } ),
      SequelizeModule.forRoot( dbConfig() ),
      EventsModule
   ],
   providers: [],
} )
export class AppModule {
}
