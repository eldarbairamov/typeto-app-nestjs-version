import { ReactNode, useRef } from "react";
import { useCallbackRef } from "@chakra-ui/react";

export const useObserver = ( next: () => void ) => {
   const observer = useRef<any>();

   const lastElemRef = useCallbackRef( ( node: ReactNode ) => {
      if ( observer.current ) observer.current.disconnect();

      observer.current = new IntersectionObserver( ( [ entry ] ) => {
         if ( entry.isIntersecting ) {
            next();
         }
      } );

      if ( node ) observer.current.observe( node );

   }, [] );

   return { lastElemRef };

};