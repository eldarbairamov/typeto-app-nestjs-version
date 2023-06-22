import { CSSProperties } from "react";

import { Button, ComponentWithAs } from "@chakra-ui/react";
import { Icon, IconProps } from "@chakra-ui/icons";
import { useColorValues } from "../../../style/colors.theme.ts";

interface IIconProps {
   size: number | string;
   as: ComponentWithAs<"svg", IconProps>;
   fn?: ( prop?: any ) => void;
   bg?: string;
   color?: string;
   rounded?: number;
   p?: number | string;
   style?: CSSProperties;
   cursor?: string;
}

export function ButtonIcon( { size, as, fn, bg, color, rounded, p, style, cursor = "pointer" }: IIconProps ) {
   const { MAIN_COLOR } = useColorValues();
   return (
       <>
          { as &&
              <Button variant={ "ghost" }
                      style={ style }
                      rounded={ rounded ? rounded : 20 }
                      p={ p }
                      cursor={ cursor }
                      bg={ bg }
                      _hover={ { bg: "transparent" } }
                      onClick={ fn }>

                  <Icon as={ as }
                        boxSize={ size }
                        cursor={ cursor }
                        _hover={ { color: MAIN_COLOR } }
                        transition={ ".3s" }
                        color={ color }/>

              </Button>
          }
       </>
   );
}