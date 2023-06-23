import { useState } from "react";

export function useHidePass() {
   const [ isShow, setIsShow ] = useState(false);
   const handleClick = () => setIsShow(!isShow);

   return { isShow, handleClick };

}