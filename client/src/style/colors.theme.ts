import { useColorModeValue } from "@chakra-ui/react";

export function useColorValues() {

   const MAIN_COLOR = "#7e75c9";

   const MAIN_COLOR_LIGHTER = "#afaad9";

   const MAIN_COLOR_SUPER_LIGHT = "#dddbef";

   const MAIN_COLOR_SUPER_LIGHT2 = "#e8e7f4";

   const MAIN_COLOR_DARKER = "#555079";

   const CONVERSATION_ACTIVE_COLOR = "#7e75c9";

   const ALERT_COLOR = "rgb(197,87,87)";

   const BG = useColorModeValue("#eff0f3", "#2d303b");

   const BG_SECOND = useColorModeValue("white", "#24262f");

   const MESSAGE_OUTCOMING_COLOR = "#7e75c9";

   const MESSAGE_INCOMING_COLOR = "#dddbef";

   const TEXT_AREA = useColorModeValue("#eff0f3", "#2d303b");

   const ICON_COLOR = useColorModeValue("blackAlpha.800", "whiteAlpha.800");

   const AVATAR_BORDER = "whiteAlpha.500";

   const WHITE_COLOR = "whiteAlpha.900";

   const BLACK_COLOR = "blackAlpha.900";

   const BUTTON_COLOR = "#7e75c9";

   const BUTTON_HOVER_COLOR = "#555079";

   const FONT_COLOR = useColorModeValue("blackAlpha.800", "whiteAlpha.800");

   const PLACEHOLDER_COLOR = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

   const FONT_SECOND = useColorModeValue("blackAlpha.700", "whiteAlpha.700");

   const LOGO_COLOR = useColorModeValue("black", "whiteAlpha.900");

   return {
      BG_SECOND,
      BUTTON_COLOR,
      BUTTON_HOVER_COLOR,
      AVATAR_BORDER,
      TEXT_AREA,
      ICON_COLOR,
      BLACK_COLOR,
      FONT_COLOR,
      CONVERSATION_ACTIVE_COLOR,
      ALERT_COLOR,
      LOGO_COLOR,
      FONT_SECOND,
      MAIN_COLOR,
      WHITE_COLOR,
      MAIN_COLOR_DARKER,
      MAIN_COLOR_SUPER_LIGHT,
      MAIN_COLOR_SUPER_LIGHT2,
      BG,
      MESSAGE_INCOMING_COLOR,
      MESSAGE_OUTCOMING_COLOR,
      MAIN_COLOR_LIGHTER,
      PLACEHOLDER_COLOR
   };
}