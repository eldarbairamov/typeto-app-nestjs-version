import React, { ForwardedRef, forwardRef } from "react";

import { VStack } from "@chakra-ui/react";
import { v4 } from "uuid";
import { IConversation, IUserFromConversation } from "../../../interface";
import { useAppSelector } from "../../../hook";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
   ref?: ForwardedRef<any>;
}

interface IConversationListProps {
   Conversation: React.FunctionComponent<IConversationProps>;
   ref?: ForwardedRef<any>
}

export const ConversationList = forwardRef(( { Conversation }: IConversationListProps, ref: any ) => {
   const { conversations } = useAppSelector(state => state.conversationReducer);

   return (
       <VStack overflow={ "scroll" }
               h={ "100%" }
               spacing={ 2 }>

          { Boolean(conversations.length) && conversations.map(( conversation, index ) => {
             if (conversations.length === index + 1) {
                if (conversation.isGroupConversation) {
                   return <Conversation key={ v4() }
                                        ref={ ref }
                                        conversation={ conversation }/>;
                }
                return conversation.conversationWith.map(user => <Conversation key={ v4() }
                                                                               user={ user }
                                                                               ref={ ref }
                                                                               conversation={ conversation }/>);
             }

             if (conversation.isGroupConversation) {
                return <Conversation key={ v4() }
                                     conversation={ conversation }/>;
             }
             return conversation.conversationWith.map(user => <Conversation key={ v4() }
                                                                            user={ user }
                                                                            conversation={ conversation }/>);
          }) }

       </VStack>
   );
});