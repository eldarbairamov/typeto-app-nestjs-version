import React, { useState } from "react";

export const useContextMenu = () => {

   const [ isCtxMenuOpen, setIsCtxMenuOpen ] = useState(false);

   const openCtxMenu = ( event: React.MouseEvent ) => {
      event.preventDefault();
      setIsCtxMenuOpen(true);
   };

   const closeCtxMenu = () => setIsCtxMenuOpen(false);

   return { isCtxMenuOpen, openCtxMenu, closeCtxMenu };
};