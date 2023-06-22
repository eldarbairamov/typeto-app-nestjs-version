import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConversationModel } from "../model";

@Injectable()
export class IsConversationExists implements CanActivate {

   constructor( @InjectModel( ConversationModel ) private conversationModel: typeof ConversationModel ) {
   }

   async canActivate( context: ExecutionContext ): Promise<any> {
      const request = context.switchToHttp().getRequest();

      let conversationId: number;

      if ( request.params.conversationId ) conversationId = request.params.conversationId;
      else conversationId = request.query.conversationId;

      const isConversationExists = await this.conversationModel.findByPk( conversationId );
      if ( !isConversationExists ) throw new HttpException( "Conversation does not exist", HttpStatus.BAD_REQUEST );

      return true;
   }
}