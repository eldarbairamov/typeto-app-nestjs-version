import * as process from "process";

export default () => ({
   PORT: process.env.PORT || 3100,

   EMAIL_SERVICE_USER: "typeto.application@gmail.com",
   EMAIL_SERVICE_PASS: "ngpbewfrdvhlwohv",

   POSTGRES_DB: process.env.POSTGRES_DB,
   POSTGRES_HOST: process.env.POSTGRES_HOST,
   POSTGRES_USER: process.env.POSTGRES_USER,
   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
   POSTGRES_PORT: process.env.POSTGRES_PORT,

   SECRET_ACCESS_TOKEN_KEY: process.env.SECRET_ACCESS_TOKEN_KEY || "access_token_secret",
   SECRET_REFRESH_TOKEN_KEY: process.env.SECRET_REFRESH_TOKEN_KEY || "refresh_token_secret",
   SECRET_RESET_PASS_KEY: process.env.SECRET_RESET_PASS_KEY || "forgot_reset_secret"
})