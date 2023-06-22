export interface IEnvironment {
   PORT: number;

   EMAIL_SERVICE_USER: string;
   EMAIL_SERVICE_PASS: string;

   SECRET_ACCESS_TOKEN_KEY: string;
   SECRET_REFRESH_TOKEN_KEY: string;
   SECRET_RESET_PASS_KEY: string;
}