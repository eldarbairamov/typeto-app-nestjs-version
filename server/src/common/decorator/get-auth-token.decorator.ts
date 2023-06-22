import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const GetAccessToken = createParamDecorator( ( data, ctx: ExecutionContext ) => {
   const request = ctx.switchToHttp().getRequest() as Request;
   return request.headers.authorization.split( " " )[1];
} );