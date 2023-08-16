import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/exception/all-exceptions.filter";
import configuration from "./config/index";

const start = async () => {
   const app = await NestFactory.create( AppModule );

   const adapterHost = app.get( HttpAdapterHost );

   app.enableCors();
   app.useGlobalPipes( new ValidationPipe( {
      transform: true,
      transformOptions: { enableImplicitConversion: true }
   } ) );
   app.useGlobalFilters( new AllExceptionsFilter( adapterHost ) );


   await app.listen( configuration().PORT );
};

start().then( () => console.log( `Database is connected. Server is started on port ${ configuration().PORT }` ) );