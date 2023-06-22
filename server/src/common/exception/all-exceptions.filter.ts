import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

   constructor( private httpAdapterHost: HttpAdapterHost ) {
   }

   catch( exception: any, host: ArgumentsHost ): any {
      const { httpAdapter } = this.httpAdapterHost

      const ctx = host.switchToHttp()

      const isSequelizeError = exception.sql
      const message = exception.errors ? exception.errors?.[0].message : exception.message

      const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

      const sequelizeResponse = {
         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         message: `Database Error: ${ message }`
      }

      const commonExceptionResponse = {
         statusCode: httpStatus,
         message: exception.message
      }

      const validationResponse = {
         statusCode: httpStatus,
         message: exception["response"]?.message
      }

      const response = isSequelizeError ? sequelizeResponse : exception instanceof HttpException && typeof exception["response"] === "object" ? validationResponse : commonExceptionResponse

      httpAdapter.reply( ctx.getResponse(), response, httpStatus )
   }

}