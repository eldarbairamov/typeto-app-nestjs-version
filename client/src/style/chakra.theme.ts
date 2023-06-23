import { extendTheme, ThemeOverride } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@fontsource/roboto";
import "@fontsource/pt-sans-narrow";

const theme: ThemeOverride = {
   fonts: {
      heading: `"Roboto", sans-serif`,
      body: `"Roboto", sans-serif`,
   },
   styles: {
      global: ( props: any ) => ({
         body: {
            bg: mode( "#eff0f3", "#2d303b" )( props ),
         },
         "*": {
            letterSpacing: -0.5,
         },
         "html, body": {
            fontSize: 14,
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
         },
         "&::-webkit-scrollbar": {
            height: 0,
            width: 0,
         },
         "&::-webkit-scrollbar-track": {
            height: 0,
            width: 0,
         },
         "&::-webkit-scrollbar-thumb": {
            background: "gray.50",
            borderRadius: "20px",

         },
         "&:focus, :focus-visible, *[data-focus]": {
            boxShadow: "none !important",
            outline: "none !important",
         },
      })
   },
   components: {
      Input: {
         baseStyle: {
            field: {
               _autofill: {
                  boxShadow: "0 0 0px 1000px transparent inset",
                  transition: "background-color 5000s ease-in-out 0s",
               },
            }
         }
      },
   },
};

export const chakraTheme = extendTheme( theme );