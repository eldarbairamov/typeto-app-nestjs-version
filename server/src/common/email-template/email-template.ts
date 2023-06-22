import { FORGOT_PASSWORD, REGISTRATION } from "../constant";

export const emailTemplate = {

   [REGISTRATION]: {
      subject: "Ласкаво просимо на борт",
      templateName: "registration",
   },

   [FORGOT_PASSWORD]: {
      subject: "Забули пароль?",
      templateName: "forgot-password",
   },

};
