import * as process from "process";

export default () => ({
   PORT: process.env.PORT || 3100,

   EMAIL_SERVICE_USER: "typeto.application@gmail.com",
   EMAIL_SERVICE_PASS: "ngpbewfrdvhlwohv",

   SECRET_ACCESS_TOKEN_KEY: process.env.SECRET_ACCESS_TOKEN_KEY || "access_token_secret",
   SECRET_REFRESH_TOKEN_KEY: process.env.SECRET_REFRESH_TOKEN_KEY || "refresh_token_secret",
   SECRET_RESET_PASS_KEY: process.env.SECRET_RESET_PASS_KEY || "forgot_reset_secret"
})