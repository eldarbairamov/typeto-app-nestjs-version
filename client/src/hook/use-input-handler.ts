import { useState } from "react";

import { TypedOnChange } from "../interface";

export function useInputHandler() {

   const [ value, setValue ] = useState<string>("");

   const handleChange = ( e: TypedOnChange ) => {
      setValue(e.target.value);
   };

   return { handleChange, value, setValue };
}