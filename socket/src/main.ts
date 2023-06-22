import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import configuration from "./config"
import { ValidationPipe } from "@nestjs/common";
import { BLUE_COLOR } from "./events/constant/colors.constant";

async function start() {
   const app = await NestFactory.create( AppModule );

   app.useGlobalPipes( new ValidationPipe() )

   await app.listen( configuration().SOCKET_PORT );
}

start().then( () => console.log( BLUE_COLOR, `Database is connected. Socket.io is started on port ${ configuration().SOCKET_PORT }` ) );
