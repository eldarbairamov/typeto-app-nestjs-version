import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../hook";
import { conversationAsyncActions, socketActions, userAsyncActions } from "../store/slice";

export const firstTouchService = () => {
   const { searchKey, limit } = useAppSelector(state => state.conversationReducer);

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const getConversations = async () => dispatch(conversationAsyncActions.getConversations({ searchKey, limit }));

   const getCurrentUser = async () => dispatch(userAsyncActions.getCurrentUser());

   useEffect(() => {
      dispatch(socketActions.connect());
      getCurrentUser();
   }, []);

   useEffect(() => {
      if (Object.keys(currentUserInfo).length) getConversations();
   }, [ searchKey, currentUserInfo, limit ]);

};