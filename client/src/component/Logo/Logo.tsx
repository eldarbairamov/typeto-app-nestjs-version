import { Heading, Highlight } from "@chakra-ui/react";
import { useColorValues } from "../../style/colors.theme.ts";

export function Logo( { color }: { color: string } ) {
   const { WHITE_COLOR } = useColorValues();

   return (
       <Heading size={ "4xl" }>

          <Highlight query={ "to" } styles={ {
             color: WHITE_COLOR,
             marginLeft: 1,
             p: "2px 15px",
             borderRadius: "15px 0 15px 15px",
             bg: color
          } }>
             typeto
          </Highlight>

       </Heading>
   );
}